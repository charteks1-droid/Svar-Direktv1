import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";

const ACCENT = "#d63031";

type Situation =
  | "felaktigt"
  | "avgift"
  | "ingenvar"
  | "overklagan"
  | "bevis";

type Tone = "kort" | "formell" | "aggressiv" | "stoppa";

const SITUATIONS: Record<Situation, string> = {
  felaktigt: "Felaktigt krav",
  avgift: "För hög avgift",
  ingenvar: "Inget svar från myndighet",
  overklagan: "Överklagan",
  bevis: "Begäran om bevis",
};

const TONES: { id: Tone; label: string; icon: string }[] = [
  { id: "kort", label: "Kort", icon: "align-left" },
  { id: "formell", label: "Formell", icon: "briefcase" },
  { id: "aggressiv", label: "Bestämd", icon: "alert-circle" },
  { id: "stoppa", label: "Stoppa indrivning", icon: "shield-off" },
];

const TEMPLATES: Record<Situation, Record<Tone, string>> = {
  felaktigt: {
    kort: `Hej,

Jag bestrider ert krav riktat till {{NAMN}} då det är felaktigt.

Jag ber er kontrollera ärendet och återkomma med bekräftelse.

Med vänliga hälsningar
{{NAMN}}`,
    formell: `Hej,

Jag, {{NAMN}}, bestrider härmed ert krav (ärendenummer: {{ÄRENDENUMMER}}, belopp: {{BELOPP}} kr) riktat mot mig av {{FÖRETAG}}.

Kravet är ogrundat och felaktigt. Jag begär att ärendet pausas omedelbart och att ni tillhandahåller skriftligt underlag som styrker kravet.

Om sådant underlag inte kan uppvisas begär jag att fordran avskrivs utan dröjsmål.

Med vänliga hälsningar
{{NAMN}}{{PERSONNUMMER_RAD}}`,
    aggressiv: `Hej,

Jag, {{NAMN}}, bestrider kategoriskt ert krav (ärende: {{ÄRENDENUMMER}}, {{BELOPP}} kr) från {{FÖRETAG}}.

Kravet är felaktigt och ogrundat. Jag kräver omedelbart stopp av alla indrivningsåtgärder.

Fortsätter ni med felaktiga krav förbehåller jag mig rätten att anmäla ärendet till Konsumentverket, Finansinspektionen och Kronofogden.

Jag förväntar mig svar inom 7 arbetsdagar.

Med vänliga hälsningar
{{NAMN}}`,
    stoppa: `Hej,

Jag, {{NAMN}}, bestrider ert krav och kräver att all indrivningsverksamhet stoppas omedelbart.

Ärendenummer: {{ÄRENDENUMMER}}
Belopp: {{BELOPP}} kr
Fordringsägare: {{FÖRETAG}}

Kravet är felaktigt. Fortsatt indrivning trots bestridan strider mot inkassolagen (1974:182) och kan utgöra trakasseri.

Jag kommer att anmäla ärendet till Integritetsskyddsmyndigheten om indrivningen inte stoppas omedelbart.

Med vänliga hälsningar
{{NAMN}}{{PERSONNUMMER_RAD}}`,
  },
  avgift: {
    kort: `Hej,

Jag anser att den debiterade avgiften på {{BELOPP}} kr från {{FÖRETAG}} är felaktig.

Vänligen kontrollera och återkom med en korrigering.

Med vänliga hälsningar
{{NAMN}}`,
    formell: `Hej,

Jag, {{NAMN}}, kontaktar er angående en debiterad avgift (ärendenummer: {{ÄRENDENUMMER}}) från {{FÖRETAG}} på totalt {{BELOPP}} kr.

Jag anser att avgiften inte stämmer överens med gällande avtal eller lagstiftning och bestrider därför hela eller delar av beloppet.

Jag begär en detaljerad specificering av avgiften samt underlag för hur beloppet har beräknats.

Med vänliga hälsningar
{{NAMN}}{{PERSONNUMMER_RAD}}`,
    aggressiv: `Hej,

Jag, {{NAMN}}, protesterar mot den felaktiga avgiften på {{BELOPP}} kr debiterad av {{FÖRETAG}} (ärende: {{ÄRENDENUMMER}}).

Avgiften saknar juridisk grund och strider mot avtalsvillkoren. Jag kräver omedelbar korrigering och återbetalning av det överskjutande beloppet.

Om detta inte åtgärdas inom 10 dagar anmäler jag ärendet till Allmänna reklamationsnämnden (ARN).

Med vänliga hälsningar
{{NAMN}}`,
    stoppa: `Hej,

Jag, {{NAMN}}, kräver att indrivningen av den felaktiga avgiften på {{BELOPP}} kr från {{FÖRETAG}} stoppas omedelbart.

Ärendenummer: {{ÄRENDENUMMER}}

Avgiften är felaktigt beräknad och jag bestrider kravet i sin helhet. Fortsatt indrivning av ett bestridet belopp strider mot god inkassosed och inkassolagen (1974:182).

Med vänliga hälsningar
{{NAMN}}{{PERSONNUMMER_RAD}}`,
  },
  ingenvar: {
    kort: `Hej,

Jag har ännu inte fått svar i mitt ärende ({{ÄRENDENUMMER}}) hos {{FÖRETAG}} trots tidigare kontakt.

Jag ber om en statusuppdatering snarast.

Med vänliga hälsningar
{{NAMN}}`,
    formell: `Hej,

Jag, {{NAMN}}, kontaktar er angående mitt ärende (ärendenummer: {{ÄRENDENUMMER}}) hos {{FÖRETAG}}.

Trots att jag tidigare skickat in handlingar och väntat i rimlig tid har jag ännu inte mottagit något svar.

Jag begär härmed ett skriftligt besked om ärendets status och beräknad handläggningstid. Enligt förvaltningslagen har jag rätt till svar inom skälig tid.

Med vänliga hälsningar
{{NAMN}}{{PERSONNUMMER_RAD}}`,
    aggressiv: `Hej,

Jag, {{NAMN}}, kräver omedelbar åtgärd i mitt ärende ({{ÄRENDENUMMER}}) hos {{FÖRETAG}}.

Trots upprepade försök att kontakta er har jag inte fått något svar. Detta är oacceptabelt och strider mot förvaltningslagens krav på skyndsam handläggning.

Om jag inte erhåller svar inom 5 arbetsdagar anmäler jag ärendet till Justitieombudsmannen (JO).

Med vänliga hälsningar
{{NAMN}}`,
    stoppa: `Hej,

Jag, {{NAMN}}, kräver att ärendet ({{ÄRENDENUMMER}}) hos {{FÖRETAG}} fryses tills jag har fått ett korrekt svar.

Jag har kontaktat er vid upprepade tillfällen utan att erhålla svar. Under dessa omständigheter kan jag inte agera vidare och all handläggning måste pausas.

Vänligen bekräfta mottagandet av detta brev och ge besked om fortsatt handläggning.

Med vänliga hälsningar
{{NAMN}}{{PERSONNUMMER_RAD}}`,
  },
  overklagan: {
    kort: `Hej,

Jag överklagar härmed beslutet (ärendenummer: {{ÄRENDENUMMER}}) från {{FÖRETAG}}.

Jag anser att beslutet är felaktigt och ber om omprövning.

Med vänliga hälsningar
{{NAMN}}`,
    formell: `Hej,

Jag, {{NAMN}}, inkommer härmed med en formell överklagan av beslutet med ärendenummer {{ÄRENDENUMMER}} fattat av {{FÖRETAG}}.

Beslutet är felaktigt grundat och saknar stöd i gällande lag. Jag begär att ärendet omprövas i sin helhet och att det ursprungliga beslutet upphävs.

Jag förbehåller mig rätten att inkomma med ytterligare handlingar och bevisning.

Med vänliga hälsningar
{{NAMN}}{{PERSONNUMMER_RAD}}`,
    aggressiv: `Hej,

Jag, {{NAMN}}, överklagar med kraft beslutet (ärende: {{ÄRENDENUMMER}}) fattat av {{FÖRETAG}}.

Beslutet är felaktigt, orättvist och strider mot gällande lagstiftning. Jag kräver omedelbar omprövning och förväntar mig ett skriftligt svar inom 10 arbetsdagar.

Underlåter ni att behandla min överklagan korrekt anmäler jag ärendet till berörd tillsynsmyndighet och Justitieombudsmannen (JO).

Med vänliga hälsningar
{{NAMN}}`,
    stoppa: `Hej,

Jag, {{NAMN}}, överklagar beslutet ({{ÄRENDENUMMER}}) och kräver att all verkställighet och indrivning stoppas under handläggningstiden.

Enligt svensk rätt ska verkställighet av ett överklagat beslut som huvudregel inte ske innan det vunnit laga kraft.

Ärendet gäller: {{BELOPP}} kr – {{FÖRETAG}}

Med vänliga hälsningar
{{NAMN}}{{PERSONNUMMER_RAD}}`,
  },
  bevis: {
    kort: `Hej,

Jag begär att ni tillhandahåller underlag och bevis som styrker ert krav (ärendenummer: {{ÄRENDENUMMER}}) från {{FÖRETAG}}.

Vänligen skicka detta till mig snarast.

Med vänliga hälsningar
{{NAMN}}`,
    formell: `Hej,

Jag, {{NAMN}}, begär härmed skriftlig dokumentation och underlag som styrker ert krav (ärendenummer: {{ÄRENDENUMMER}}, belopp: {{BELOPP}} kr) från {{FÖRETAG}}.

Utan fullständig dokumentation kan jag inte bedöma kravets riktighet och bestrider det tills dess att bevis har inkommit.

Jag begär att ni skickar: faktura/avtal, beräkningsunderlag samt eventuella kvitton.

Med vänliga hälsningar
{{NAMN}}{{PERSONNUMMER_RAD}}`,
    aggressiv: `Hej,

Jag, {{NAMN}}, kräver omedelbart att {{FÖRETAG}} tillhandahåller fullständig dokumentation för kravet (ärende: {{ÄRENDENUMMER}}, {{BELOPP}} kr).

Ni har skyldighet att bevisa er fordran. Utan bevisning är kravet ogiltigt.

Jag ger er 7 dagar på er att tillhandahålla bevis. I annat fall anmäler jag ärendet till Kronofogden och Konsumentverket.

Med vänliga hälsningar
{{NAMN}}`,
    stoppa: `Hej,

Jag, {{NAMN}}, kräver att all indrivning stoppas omedelbart (ärende: {{ÄRENDENUMMER}}) tills {{FÖRETAG}} har tillhandahållit fullständigt bevisunderlag för fordran på {{BELOPP}} kr.

Indrivning av en fordran som inte kan styrkas strider mot god inkassosed och inkassolagen (1974:182).

Om indrivningen inte stoppas omedelbart anmäler jag ärendet till Integritetsskyddsmyndigheten.

Med vänliga hälsningar
{{NAMN}}{{PERSONNUMMER_RAD}}`,
  },
};

interface Fields {
  namn: string;
  personnummer: string;
  arendenummer: string;
  belopp: string;
  foretag: string;
}

function buildMessage(template: string, fields: Fields): string {
  const personnummerRad =
    fields.personnummer.trim()
      ? `\nPersonnummer: ${fields.personnummer.trim()}`
      : "";

  return template
    .replace(/{{NAMN}}/g, fields.namn.trim() || "[ditt namn]")
    .replace(/{{PERSONNUMMER}}/g, fields.personnummer.trim() || "[personnummer]")
    .replace(/{{PERSONNUMMER_RAD}}/g, personnummerRad)
    .replace(/{{ÄRENDENUMMER}}/g, fields.arendenummer.trim() || "[ärendenummer]")
    .replace(/{{BELOPP}}/g, fields.belopp.trim() || "[belopp]")
    .replace(/{{FÖRETAG}}/g, fields.foretag.trim() || "[myndighet/företag]");
}

function TonePill({
  tone,
  selected,
  onPress,
}: {
  tone: (typeof TONES)[0];
  selected: boolean;
  onPress: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tonePill,
        {
          backgroundColor: selected ? ACCENT : theme.card,
          borderColor: selected ? ACCENT : theme.cardBorder,
        },
      ]}
    >
      <Text
        style={[
          styles.tonePillText,
          {
            color: selected ? "#fff" : theme.textSecondary,
            fontFamily: selected ? "Inter_600SemiBold" : "Inter_400Regular",
          },
        ]}
      >
        {tone.label}
      </Text>
    </Pressable>
  );
}

function FieldInput({
  label,
  value,
  onChangeText,
  placeholder,
  optional,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  optional?: boolean;
  keyboardType?: "default" | "numeric" | "decimal-pad";
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.fieldRow, { borderBottomColor: theme.separator }]}>
      <View style={styles.fieldLabelRow}>
        <Text style={[styles.fieldLabel, { color: theme.textSecondary, fontFamily: "Inter_500Medium" }]}>
          {label}
        </Text>
        {optional && (
          <Text style={[styles.fieldOptional, { color: theme.textTertiary, fontFamily: "Inter_400Regular" }]}>
            valfritt
          </Text>
        )}
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary}
        keyboardType={keyboardType ?? "default"}
        style={[styles.fieldInput, { color: theme.text, fontFamily: "Inter_400Regular" }]}
        autoCapitalize="sentences"
        autoCorrect={false}
      />
    </View>
  );
}

export default function ForsvarScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { situation: situationParam } = useLocalSearchParams<{ situation: string }>();
  const { addToHistory } = useApp();

  const situation = (situationParam as Situation) ?? "felaktigt";
  const situationLabel = SITUATIONS[situation] ?? "Försvara dig";

  const [tone, setTone] = useState<Tone>("formell");
  const [fields, setFields] = useState<Fields>({
    namn: "",
    personnummer: "",
    arendenummer: "",
    belopp: "",
    foretag: "",
  });
  const [copied, setCopied] = useState(false);

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const template = TEMPLATES[situation]?.[tone] ?? "";
  const message = useMemo(() => buildMessage(template, fields), [template, fields]);

  const setField = (key: keyof Fields) => (val: string) =>
    setFields((prev) => ({ ...prev, [key]: val }));

  const handleCopy = async () => {
    await Clipboard.setStringAsync(message);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addToHistory({ templateTitle: `${situationLabel} – ${TONES.find(t => t.id === tone)?.label}`, content: message });
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleEmail = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const subject = encodeURIComponent("Ärende – begäran");
    const body = encodeURIComponent(message);
    const url = `mailto:?subject=${subject}&body=${body}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Situation badge */}
        <View style={[styles.situationBadge, { backgroundColor: ACCENT + "18" }]}>
          <Feather name="shield" size={14} color={ACCENT} />
          <Text style={[styles.situationBadgeText, { color: ACCENT, fontFamily: "Inter_600SemiBold" }]}>
            {situationLabel}
          </Text>
        </View>

        {/* Tone selector */}
        <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
          VÄLJ TON
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toneRow}
        >
          {TONES.map((t) => (
            <TonePill
              key={t.id}
              tone={t}
              selected={tone === t.id}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setTone(t.id);
                setCopied(false);
              }}
            />
          ))}
        </ScrollView>

        {/* Fields */}
        <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
          DINA UPPGIFTER
        </Text>
        <View style={[styles.fieldsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <FieldInput
            label="Namn"
            value={fields.namn}
            onChangeText={setField("namn")}
            placeholder="Ditt fullständiga namn"
          />
          <FieldInput
            label="Personnummer"
            value={fields.personnummer}
            onChangeText={setField("personnummer")}
            placeholder="ÅÅMMDD-XXXX"
            optional
            keyboardType="default"
          />
          <FieldInput
            label="Ärendenummer"
            value={fields.arendenummer}
            onChangeText={setField("arendenummer")}
            placeholder="T.ex. 12345678"
          />
          <FieldInput
            label="Belopp (kr)"
            value={fields.belopp}
            onChangeText={setField("belopp")}
            placeholder="T.ex. 2 500"
            keyboardType="decimal-pad"
          />
          <FieldInput
            label="Företag / Myndighet"
            value={fields.foretag}
            onChangeText={setField("foretag")}
            placeholder="T.ex. Kronofogden"
          />
        </View>

        {/* Message preview */}
        <View style={styles.previewHeader}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
            DITT MEDDELANDE
          </Text>
          <View style={[styles.toneBadge, { backgroundColor: ACCENT + "18" }]}>
            <Text style={[styles.toneBadgeText, { color: ACCENT, fontFamily: "Inter_600SemiBold" }]}>
              {TONES.find(t => t.id === tone)?.label}
            </Text>
          </View>
        </View>
        <View style={[styles.messageBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.messageText, { color: theme.text, fontFamily: "Inter_400Regular" }]} selectable>
            {message}
          </Text>
        </View>

        <View style={[styles.hintBox, { backgroundColor: theme.backgroundTertiary }]}>
          <Feather name="info" size={14} color={ACCENT} />
          <Text style={[styles.hintText, { color: theme.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Text inom [hakparenteser] ersätts automatiskt när du fyller i dina uppgifter ovan.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky copy button */}
      <View
        style={[
          styles.stickyBottom,
          {
            paddingBottom: bottomPad + 12,
            backgroundColor: theme.backgroundSecondary,
            borderTopColor: theme.separator,
          },
        ]}
      >
        <Pressable
          onPress={handleCopy}
          style={({ pressed }) => [
            styles.copyBtn,
            {
              backgroundColor: copied ? theme.success : ACCENT,
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <Feather name={copied ? "check" : "copy"} size={20} color="#fff" />
          <Text style={[styles.copyBtnText, { fontFamily: "Inter_700Bold" }]}>
            {copied ? "Kopierat!" : "Kopiera meddelande"}
          </Text>
        </Pressable>
        <Pressable
          onPress={handleEmail}
          style={({ pressed }) => [
            styles.emailBtn,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <Feather name="mail" size={18} color={theme.textSecondary} />
          <Text style={[styles.emailBtnText, { color: theme.textSecondary, fontFamily: "Inter_600SemiBold" }]}>
            Skicka via e-post
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },

  situationBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  situationBadgeText: { fontSize: 13 },

  sectionLabel: {
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  toneRow: {
    gap: 8,
    paddingBottom: 2,
    paddingRight: 4,
    marginBottom: 20,
  },
  tonePill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tonePillText: { fontSize: 14 },

  fieldsCard: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    marginBottom: 20,
  },
  fieldRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  fieldLabel: { fontSize: 11, letterSpacing: 0.4, textTransform: "uppercase" },
  fieldOptional: { fontSize: 10 },
  fieldInput: { fontSize: 16, paddingVertical: 0 },

  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  toneBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  toneBadgeText: { fontSize: 11 },

  messageBox: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 24,
  },

  hintBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  hintText: { flex: 1, fontSize: 13, lineHeight: 18 },

  stickyBottom: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 56,
    borderRadius: 16,
  },
  copyBtnText: {
    color: "#fff",
    fontSize: 17,
  },

  emailBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 50,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 8,
  },
  emailBtnText: {
    fontSize: 15,
  },
});
