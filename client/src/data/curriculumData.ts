import { Section, Unit, PathNode, UnitGuidebookPhrase } from '../types';

export interface UnitThemeConfig {
  color: string;
  headerGradient: string;
  headerBorder: string;
  headerPillBg: string;
  headerPillText: string;
  headerTitleText: string;
  headerDescText: string;
  nodeBg: string;
  nodeHoverBg: string;
  nodeShadow: string;
  nodeBorder: string;
  activeRing: string;
  dividerLine: string;
  chestBg: string;
  trophyBg: string;
}

export const UNIT_THEMES: Record<string, UnitThemeConfig> = {
  green: {
    color: 'green',
    headerGradient: 'from-emerald-600 via-emerald-700 to-emerald-800',
    headerBorder: 'border-emerald-500/50',
    headerPillBg: 'bg-emerald-400/20 border-emerald-300/40 text-emerald-100',
    headerPillText: 'text-emerald-100',
    headerTitleText: 'text-cream-50',
    headerDescText: 'text-emerald-100',
    nodeBg: 'bg-emerald-500 text-white shadow-[0_6px_0_#065f46]',
    nodeHoverBg: 'hover:bg-emerald-400',
    nodeShadow: '#065f46',
    nodeBorder: 'border-emerald-600',
    activeRing: 'ring-emerald-300/80',
    dividerLine: 'border-emerald-300',
    chestBg: 'bg-emerald-100 text-emerald-800',
    trophyBg: 'bg-emerald-600 text-gold-300',
  },
  purple: {
    color: 'purple',
    headerGradient: 'from-purple-700 via-purple-800 to-indigo-900',
    headerBorder: 'border-purple-500/50',
    headerPillBg: 'bg-purple-400/20 border-purple-300/40 text-purple-100',
    headerPillText: 'text-purple-100',
    headerTitleText: 'text-cream-50',
    headerDescText: 'text-purple-100',
    nodeBg: 'bg-purple-600 text-white shadow-[0_6px_0_#581c87]',
    nodeHoverBg: 'hover:bg-purple-500',
    nodeShadow: '#581c87',
    nodeBorder: 'border-purple-700',
    activeRing: 'ring-purple-300/80',
    dividerLine: 'border-purple-300',
    chestBg: 'bg-purple-100 text-purple-800',
    trophyBg: 'bg-purple-700 text-gold-300',
  },
  blue: {
    color: 'blue',
    headerGradient: 'from-sky-600 via-blue-700 to-blue-800',
    headerBorder: 'border-sky-500/50',
    headerPillBg: 'bg-sky-400/20 border-sky-300/40 text-sky-100',
    headerPillText: 'text-sky-100',
    headerTitleText: 'text-cream-50',
    headerDescText: 'text-sky-100',
    nodeBg: 'bg-blue-600 text-white shadow-[0_6px_0_#1e3a8a]',
    nodeHoverBg: 'hover:bg-blue-500',
    nodeShadow: '#1e3a8a',
    nodeBorder: 'border-blue-700',
    activeRing: 'ring-blue-300/80',
    dividerLine: 'border-blue-300',
    chestBg: 'bg-blue-100 text-blue-800',
    trophyBg: 'bg-blue-700 text-gold-300',
  },
  amber: {
    color: 'amber',
    headerGradient: 'from-amber-600 via-amber-700 to-orange-800',
    headerBorder: 'border-amber-500/50',
    headerPillBg: 'bg-amber-400/20 border-amber-300/40 text-amber-100',
    headerPillText: 'text-amber-100',
    headerTitleText: 'text-cream-50',
    headerDescText: 'text-amber-100',
    nodeBg: 'bg-amber-500 text-white shadow-[0_6px_0_#9a3412]',
    nodeHoverBg: 'hover:bg-amber-400',
    nodeShadow: '#9a3412',
    nodeBorder: 'border-amber-600',
    activeRing: 'ring-amber-300/80',
    dividerLine: 'border-amber-300',
    chestBg: 'bg-amber-100 text-amber-800',
    trophyBg: 'bg-amber-600 text-gold-300',
  },
  rose: {
    color: 'rose',
    headerGradient: 'from-rose-600 via-rose-700 to-pink-800',
    headerBorder: 'border-rose-500/50',
    headerPillBg: 'bg-rose-400/20 border-rose-300/40 text-rose-100',
    headerPillText: 'text-rose-100',
    headerTitleText: 'text-cream-50',
    headerDescText: 'text-rose-100',
    nodeBg: 'bg-rose-500 text-white shadow-[0_6px_0_#881337]',
    nodeHoverBg: 'hover:bg-rose-400',
    nodeShadow: '#881337',
    nodeBorder: 'border-rose-600',
    activeRing: 'ring-rose-300/80',
    dividerLine: 'border-rose-300',
    chestBg: 'bg-rose-100 text-rose-800',
    trophyBg: 'bg-rose-600 text-gold-300',
  },
  teal: {
    color: 'teal',
    headerGradient: 'from-teal-600 via-teal-700 to-cyan-800',
    headerBorder: 'border-teal-500/50',
    headerPillBg: 'bg-teal-400/20 border-teal-300/40 text-teal-100',
    headerPillText: 'text-teal-100',
    headerTitleText: 'text-cream-50',
    headerDescText: 'text-teal-100',
    nodeBg: 'bg-teal-500 text-white shadow-[0_6px_0_#115e59]',
    nodeHoverBg: 'hover:bg-teal-400',
    nodeShadow: '#115e59',
    nodeBorder: 'border-teal-600',
    activeRing: 'ring-teal-300/80',
    dividerLine: 'border-teal-300',
    chestBg: 'bg-teal-100 text-teal-800',
    trophyBg: 'bg-teal-600 text-gold-300',
  },
  indigo: {
    color: 'indigo',
    headerGradient: 'from-indigo-700 via-indigo-800 to-slate-900',
    headerBorder: 'border-indigo-500/50',
    headerPillBg: 'bg-indigo-400/20 border-indigo-300/40 text-indigo-100',
    headerPillText: 'text-indigo-100',
    headerTitleText: 'text-cream-50',
    headerDescText: 'text-indigo-100',
    nodeBg: 'bg-indigo-600 text-white shadow-[0_6px_0_#312e81]',
    nodeHoverBg: 'hover:bg-indigo-500',
    nodeShadow: '#312e81',
    nodeBorder: 'border-indigo-700',
    activeRing: 'ring-indigo-300/80',
    dividerLine: 'border-indigo-300',
    chestBg: 'bg-indigo-100 text-indigo-800',
    trophyBg: 'bg-indigo-700 text-gold-300',
  },
  gold: {
    color: 'gold',
    headerGradient: 'from-amber-500 via-yellow-600 to-amber-700',
    headerBorder: 'border-yellow-400/50',
    headerPillBg: 'bg-yellow-400/20 border-yellow-300/40 text-yellow-100',
    headerPillText: 'text-yellow-100',
    headerTitleText: 'text-cream-50',
    headerDescText: 'text-yellow-100',
    nodeBg: 'bg-amber-400 text-teal-950 shadow-[0_6px_0_#b45309]',
    nodeHoverBg: 'hover:bg-amber-300',
    nodeShadow: '#b45309',
    nodeBorder: 'border-amber-500',
    activeRing: 'ring-amber-200/80',
    dividerLine: 'border-amber-300',
    chestBg: 'bg-amber-100 text-amber-800',
    trophyBg: 'bg-amber-500 text-gold-100',
  },
};

// Unit Theme Colors in order of sequence
const THEME_CYCLE = ['green', 'purple', 'blue', 'amber', 'rose', 'teal', 'indigo', 'gold'];

interface LanguageMeta {
  scriptChars: string[];
  samplePhrases: UnitGuidebookPhrase[][];
  proverbs: { text: string; meaning: string }[];
}

const LANGUAGE_CURRICULUM_DATA: Record<string, LanguageMeta> = {
  santali: {
    scriptChars: ['ᱚ', 'ᱛ', 'ᱜ', 'ᱝ', 'ᱞ', 'ᱟ', 'ᱠ', 'ᱡ'],
    samplePhrases: [
      [
        { native: 'ᱡᱚᱦᱟᱨ', roman: 'Johar', meaning: 'Traditional Reverent Greeting' },
        { native: 'ᱵᱮᱥ ᱜᱮ', roman: 'Besh ge', meaning: 'Doing well / Good' },
        { native: 'ᱥᱟᱨᱦᱟᱣ', roman: 'Sarhao', meaning: 'Thank you' },
        { native: 'ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ', roman: 'Adi napay', meaning: 'Very good / Wonderful' },
      ],
      [
        { native: 'ᱟᱭᱳ', roman: 'Ayo', meaning: 'Mother' },
        { native: 'ᱟᱯᱩ', roman: 'Apu', meaning: 'Father' },
        { native: 'ᱵᱚᱠᱚ', roman: 'Boko', meaning: 'Younger sibling' },
        { native: 'ᱚᱲᱟᱜ', roman: "Orak'", meaning: 'Home / Hearth' },
      ],
      [
        { native: 'ᱵᱤᱨ', roman: 'Bir', meaning: 'Sacred Forest' },
        { native: 'ᱫᱟᱜ', roman: "Da'", meaning: 'Life-giving Water / Rain' },
        { native: 'ᱥᱟᱨᱡᱚᱢ', roman: 'Sarjom', meaning: 'Sacred Sal Tree' },
        { native: 'ᱵᱟᱦᱟ', roman: 'Baha', meaning: 'Flower / Spring Blossom' },
      ],
      [
        { native: 'ᱫᱟᱠᱟ', roman: 'Daka', meaning: 'Steamed Rice / Food' },
        { native: 'ᱦᱟᱹᱠᱩ', roman: 'Haku', meaning: 'Fish' },
        { native: 'ᱢᱟᱹᱱᱫᱤ', roman: 'Mandi', meaning: 'Feast meal' },
        { native: 'ᱧᱩᱭ ᱢᱮ', roman: 'Nyuy me', meaning: 'Please drink' },
      ],
      [
        { native: 'ᱚᱞ ᱪᱤᱠᱤ', roman: 'Ol Chiki', meaning: 'Sacred Santali Script' },
        { native: 'ᱨᱟᱹᱦᱤ', roman: 'Rahi', meaning: 'Harmony / Sound' },
        { native: 'ᱯᱩᱛᱷᱤ', roman: 'Puthi', meaning: 'Book of wisdom' },
        { native: 'ᱥᱮᱨᱮᱧ', roman: 'Sereng', meaning: 'Sacred Song' },
      ],
      [
        { native: 'ᱢᱤᱫ', roman: "Mit'", meaning: 'One (1)' },
        { native: 'ᱵᱟᱨ', roman: 'Bar', meaning: 'Two (2)' },
        { native: 'ᱯᱮ', roman: 'Pe', meaning: 'Three (3)' },
        { native: 'ᱜᱟᱯᱟ', roman: 'Gapa', meaning: 'Tomorrow' },
      ],
      [
        { native: 'ᱦᱟᱹᱛᱤ', roman: 'Hati', meaning: 'Elephant (Sacred Guardian)' },
        { native: 'ᱪᱮᱬᱮ', roman: 'Chene', meaning: 'Bird of the woodland' },
        { native: 'ᱥᱮᱛᱟ', roman: 'Seta', meaning: 'Loyal Dog' },
        { native: 'ᱜᱟᱹᱭ', roman: 'Gay', meaning: 'Cow of the homestead' },
      ],
      [
        { native: 'ᱥᱚᱦᱨᱟᱭ', roman: 'Sohray', meaning: 'Grand Harvest Thanksgiving' },
        { native: 'ᱵᱟᱦᱟ ᱯᱚᱨᱚᱵᱽ', roman: 'Baha Parab', meaning: 'Sacred Flower Festival' },
        { native: 'ᱮᱱᱮᱡ', roman: 'Enej', meaning: 'Communal Circular Dance' },
        { native: 'ᱨᱟᱹᱥᱠᱟᱹ', roman: 'Raska', meaning: 'Pure Joy and Ecstasy' },
      ],
    ],
    proverbs: [
      { text: "Diri leka ketet', Da' leka rered", meaning: 'Firm as rock, crystal clear like forest water.' },
      { text: 'Ayo-Apu seba ge manwa rema dhorom', meaning: 'Honoring mother, father, and earth is true human reverence.' },
      { text: 'Bir banchao, Jiwi banchao', meaning: 'Protect the forest to protect all living spirits.' },
      { text: 'Mihun gupi hopon katha manao', meaning: 'Gentleness with cattle and truthfulness with elders brings longevity.' },
      { text: 'Ol Chiki bon chera, Bhasa bon jiyara', meaning: 'Learn our script to keep our ancestral flame burning.' },
      { text: 'Sohray din re marang bonga bhor emay', meaning: 'At harvest thanksgiving, the creator blesses all granaries.' },
      { text: 'Chando gogo bonga buru shanti koy', meaning: 'The sun and moon watch over every honest heart.' },
      { text: 'Hatu hopon mit leka juri jatai', meaning: 'A village stands invincible when hearts beat as one.' },
    ],
  },
  mundari: {
    scriptChars: ['जो', 'बु', 'हा', 'मा', 'से', 'ओ', 'न', 'गा'],
    samplePhrases: [
      [
        { native: 'जोहार', roman: 'Johar', meaning: 'Greetings of Peace and Solidarity' },
        { native: 'बुगिगेया', roman: 'Bugigea', meaning: 'I am doing well / Peaceful' },
        { native: 'हागा', roman: 'Haga', meaning: 'Brother / Kin' },
        { native: 'मारंग', roman: 'Marang', meaning: 'Elder / Respected' },
      ],
      [
        { native: 'आइंग', roman: 'Aing', meaning: 'I / Myself' },
        { native: 'आम', roman: 'Am', meaning: 'You' },
        { native: 'नुतुम', roman: 'Nutum', meaning: 'Name / Identity' },
        { native: 'दिसुम', roman: 'Disum', meaning: 'Homeland / Mother Country' },
      ],
      [
        { native: 'सेसेनापे', roman: 'Senenape', meaning: 'Go safely on your journey' },
        { native: 'ओरोबु', roman: 'Orobu', meaning: 'Again' },
        { native: 'नपामा', roman: 'Napama', meaning: 'We will meet' },
        { native: 'गापा', roman: 'Gapa', meaning: 'Tomorrow' },
      ],
      [
        { native: 'मंडी', roman: 'Mandi', meaning: 'Traditional Cooked Meal' },
        { native: 'दाअ', roman: "Da'", meaning: 'Fresh Well Water' },
        { native: 'हेसे', roman: 'Hese', meaning: 'Yes / Accepted' },
        { native: 'कागे', roman: 'Kage', meaning: 'No / Refused gently' },
      ],
      [
        { native: 'हातु', roman: 'Hatu', meaning: 'Village settlement' },
        { native: 'बुरु', roman: 'Buru', meaning: 'Sacred Hill / Mountain' },
        { native: 'गाड़ा', roman: 'Gada', meaning: 'Flowing River' },
        { native: 'इपील', roman: 'Ipil', meaning: 'Star in the night sky' },
      ],
      [
        { native: 'मियाद', roman: 'Miyad', meaning: 'One (1)' },
        { native: 'बारिया', roman: 'Bariya', meaning: 'Two (2)' },
        { native: 'आपिया', roman: 'Apiya', meaning: 'Three (3)' },
        { native: 'उपूनिया', roman: 'Upuniya', meaning: 'Four (4)' },
      ],
      [
        { native: 'किली', roman: 'Kili', meaning: 'Ancestral Clan Clan' },
        { native: 'पाहान', roman: 'Pahan', meaning: 'Village Spiritual Guardian' },
        { native: 'माकी', roman: 'Manki', meaning: 'Leader of twelve villages' },
        { native: 'ससन', roman: 'Sasan', meaning: 'Ancestral Burial Cairn' },
      ],
      [
        { native: 'सरहुल', roman: 'Sarhul / Baa', meaning: 'Flower Festival of the Sal Tree' },
        { native: 'करम', roman: 'Karam', meaning: 'Festival of Youth, Siblings & Nature' },
        { native: 'सुसुन', roman: 'Susun', meaning: 'Sacred Dance in Circle' },
        { native: 'दुरंग', roman: 'Durang', meaning: 'Song of Living Lore' },
      ],
    ],
    proverbs: [
      { text: 'हातु रेगा हागा, दिसुम रेगा दिया', meaning: 'A neighbor is kin in the village; justice is light for the nation.' },
      { text: 'गाड़ा दाअ लेका जीवन सेना ओते', meaning: 'Life flows onward peacefully like a pure forest stream.' },
      { text: 'बुरु बोंगा सबाय, हातु सुखी ताय', meaning: 'Revere the sacred hill spirits, and the village flourishes.' },
      { text: 'सरहुल रे बाहा, करम रे हागा', meaning: 'Flowers bloom at Sarhul; bonds of brotherhood strengthen at Karam.' },
      { text: 'किली नुतुम बान्चाओ, सामाज बान्चाओ', meaning: 'Preserve clan honor and you protect the foundation of society.' },
      { text: 'सुसुन दुरंग ते जीवी रासा', meaning: 'Dance and music fill the human spirit with sacred sweetness.' },
      { text: 'दिसुम आमगा, सेबा आमगा', meaning: 'The motherland is yours; honor her with selfless service.' },
      { text: 'जोहार रे दया, ओरोबु रे माया', meaning: 'In Johar lies kindness; in parting lies enduring affection.' },
    ],
  },
  ho: {
    scriptChars: ['𑢹', '𑢡', '𑢢', '𑢣', '𑢤', '𑢥', '𑢦', '𑢧'],
    samplePhrases: [
      [
        { native: 'ᱡᱚᱦᱟᱨ', roman: 'Johar', meaning: 'Reverent Respectful Greeting' },
        { native: 'ᱪᱤᱞᱠᱟᱱ', roman: 'Chilkan', meaning: 'How / In what state' },
        { native: 'ᱵᱩᱜᱤᱛᱮ', roman: 'Bugite', meaning: 'Well / In good health' },
        { native: 'ᱢᱮᱱᱟᱧᱟ', roman: 'Menanya', meaning: 'I am here' },
      ],
      [
        { native: 'ᱦᱟᱛᱩ', roman: 'Hatu', meaning: 'Ancestral Village' },
        { native: 'ᱵᱩᱨᱩ', roman: 'Buru', meaning: 'Hill of the Guardian Spirits' },
        { native: 'ᱫᱟᱹᱭ', roman: 'Dai', meaning: 'Elder Sister' },
        { native: 'ᱫᱟᱫᱟ', roman: 'Dada', meaning: 'Elder Brother' },
      ],
      [
        { native: 'ᱦᱮ', roman: 'He', meaning: 'Yes' },
        { native: 'ᱠᱟ', roman: 'Ka', meaning: 'No' },
        { native: 'ᱫᱟᱜ', roman: "Da'", meaning: 'Pure Water' },
        { native: 'ᱢᱟᱱᱰᱤ', roman: 'Mandi', meaning: 'Meal / Fellowship' },
      ],
      [
        { native: 'ᱣᱟᱨᱟᱝ ᱪᱤᱛᱤ', roman: 'Warang Citi', meaning: 'The Sacred Ho Script' },
        { native: 'ᱚᱞ', roman: 'Ol', meaning: 'To write and document' },
        { native: 'ᱯᱟᱲᱦᱟᱣ', roman: 'Parhao', meaning: 'To study and learn' },
        { native: 'ᱫᱩᱨᱟᱝ', roman: 'Durang', meaning: 'Melody and Song' },
      ],
      [
        { native: 'ᱢᱤᱭᱟᱫ', roman: 'Miyad', meaning: 'One (1)' },
        { native: 'ᱵᱟᱨᱤᱭᱟ', roman: 'Bariya', meaning: 'Two (2)' },
        { native: 'ᱟᱯᱤᱭᱟ', roman: 'Apiya', meaning: 'Three (3)' },
        { native: 'ᱩᱯᱩᱱᱤᱭᱟ', roman: 'Upuniya', meaning: 'Four (4)' },
      ],
      [
        { native: 'ᱢᱟᱜᱷᱮ', roman: 'Maghe', meaning: 'Principal Festival of Thanksgiving' },
        { native: 'ᱵᱟᱦᱟ', roman: 'Baha', meaning: 'Flower Festival of Sal Blooms' },
        { native: 'ᱫᱮᱣᱸᱲᱟ', roman: 'Dewan', meaning: 'Spiritual Healer / Priest' },
        { native: 'ᱫᱩᱢᱟᱝ', roman: 'Dumang', meaning: 'Traditional Rhythm Drum' },
      ],
      [
        { native: 'ᱥᱤᱧ ᱵᱚᱸᱜᱟ', roman: 'Sing Bonga', meaning: 'Supreme Divine Creator of the Sun' },
        { native: 'ᱢᱟᱨᱟᱝ ᱵᱩᱨᱩ', roman: 'Marang Buru', meaning: 'Great Guardian Mountain Spirit' },
        { native: 'ᱫᱮᱥᱟᱣᱞᱤ', roman: 'Desauli', meaning: 'Sacred Grove of the Village' },
        { native: 'ᱥᱟᱥᱟᱱ', roman: 'Sasan', meaning: 'Megalithic Stone Memorial' },
      ],
      [
        { native: 'ᱥᱩᱥᱩᱱ', roman: 'Susun', meaning: 'Hand-in-hand community dance' },
        { native: 'ᱨᱟᱹᱥᱠᱟᱹ', roman: 'Raska', meaning: 'Pure joy and celebration' },
        { native: 'ᱡᱤᱣᱤ', roman: 'Jiwi', meaning: 'Soul / Life energy' },
        { native: 'ᱢᱟᱱᱣᱟ', roman: 'Manwa', meaning: 'Human being in nature' },
      ],
    ],
    proverbs: [
      { text: 'Sing Bonga bhor te hatu te ba', meaning: 'With Sing Bonga’s grace, the village blooms like spring.' },
      { text: 'Hatu Buru banchao re manwa jiwi', meaning: 'In the sanctuary of hills and villages dwells human peace.' },
      { text: 'Warang Citi chera leka bicar gayan', meaning: 'Embracing Warang Citi illuminates deep ancestral wisdom.' },
      { text: 'Maghe Parab re kili ko milao', meaning: 'At Maghe festival, separated kin gather with warm embraces.' },
      { text: 'Desauli jaher than bonga ra shanti', meaning: 'The sacred grove radiates calmness for the entire region.' },
      { text: 'Dumang rutu re raska leka jom', meaning: 'The rhythm of the drum and flute dissolves all sadness.' },
      { text: 'Mihun gai leka nawa jiwi', meaning: 'Live gently as cattle grazing upon the peaceful meadow.' },
      { text: 'Sasan dhorom re bonga ko ashirbad', meaning: 'Ancestral memories in the stone memorials guide the living.' },
    ],
  },
  kurukh: {
    scriptChars: ['गो', 'ड़', 'ला', 'गी', 'को', 'ड़े', 'र', 'ही'],
    samplePhrases: [
      [
        { native: 'गोड़ लागी', roman: 'God Lagi', meaning: 'Reverent Salutation (Touching feet of elders)' },
        { native: 'एक’अस', roman: "Ek'as", meaning: 'How / In what state' },
        { native: 'कोड़े रही', roman: 'Kode rahi', meaning: 'I am doing well and peaceful' },
        { native: 'रही', roman: 'Rahi', meaning: 'Are / To exist' },
      ],
      [
        { native: 'एरपा', roman: 'Erpa', meaning: 'Home and Family Hearth' },
        { native: 'पद्दी', roman: 'Paddi', meaning: 'Ancestral Village' },
        { native: 'आयो', roman: 'Ayo', meaning: 'Mother' },
        { native: 'बाबा', roman: 'Baba', meaning: 'Father' },
      ],
      [
        { native: 'हअ', roman: 'Ha', meaning: 'Yes' },
        { native: 'मला', roman: 'Mala', meaning: 'No' },
        { native: 'अम्म', roman: 'Amm', meaning: 'Water of life' },
        { native: 'मंडी', roman: 'Mandi', meaning: 'Rice meal' },
      ],
      [
        { native: 'तोंलोंग सिकी', roman: 'Tolong Siki', meaning: 'Sacred Kurukh Script' },
        { native: 'कथ्थ', roman: 'Kathth', meaning: 'Mother tongue / Speech' },
        { native: 'पढ़ना', roman: 'Parhna', meaning: 'Knowledge gathering' },
        { native: 'डंडी', roman: 'Dandi', meaning: 'Folk song and oral poem' },
      ],
      [
        { native: 'ओन्द', roman: 'Ond', meaning: 'One (1)' },
        { native: 'इरंद', roman: 'Irand', meaning: 'Two (2)' },
        { native: 'मूंद', roman: 'Mund', meaning: 'Three (3)' },
        { native: 'नाख', roman: 'Naakh', meaning: 'Four (4)' },
      ],
      [
        { native: 'खद्दी', roman: 'Khaddi / Sarhul', meaning: 'Spring Sal Blossom Feast' },
        { native: 'करम', roman: 'Karam', meaning: 'Karam Tree Thanksgiving' },
        { native: 'पाहन', roman: 'Pahan', meaning: 'Sacred Village Priest' },
        { native: 'सरना', roman: 'Sarna', meaning: 'Sacred Grove of the Shal Trees' },
      ],
      [
        { native: 'धर्मेश', roman: 'Dharmesh', meaning: 'Supreme Radiant Creator' },
        { native: 'चाला आयो', roman: 'Chala Ayo', meaning: 'Mother Goddess of the Grove' },
        { native: 'धूमकुड़िया', roman: 'Dhumkuria', meaning: 'Traditional Youth Academy of Wisdom' },
        { native: 'पड़हा', roman: 'Parha', meaning: 'Confederacy of 21 Villages' },
      ],
      [
        { native: 'नलना', roman: 'Nalna', meaning: 'Harmonious Circular Dance' },
        { native: 'खुशी', roman: 'Khushi', meaning: 'Heartfelt Bliss' },
        { native: 'जीया', roman: 'Jiya', meaning: 'Living Spirit' },
        { native: 'मानवा', roman: 'Manwa', meaning: 'Human sibling on Earth' },
      ],
    ],
    proverbs: [
      { text: 'धर्मेशी गहि दया ती एरपा सुख', meaning: 'By the grace of Dharmesh, peace fills every household.' },
      { text: 'चाला आयो सरना बोंगा गहि रक्षा', meaning: 'Mother of the sacred grove protects the harvests of all villages.' },
      { text: 'कथ्थ बान्चाओ ती जाति बान्ची', meaning: 'Preserve the Kurukh language, and our living identity endures.' },
      { text: 'धूमकुड़िया ती गियान, सरना ती धरम', meaning: 'Dhumkuria instills wisdom; the sacred grove nurtures virtue.' },
      { text: 'खद्दी परब रे पाहन पूजा', meaning: 'At the Sarhul spring feast, the priest unites earth and heaven.' },
      { text: 'अम्म मंडी लेका जीवन संवार', meaning: 'Live as nourishing and humble as clean water and simple rice.' },
      { text: 'पड़हा राजा न्याय लेका सुख', meaning: 'Where the Parha elders uphold truth, joy spreads everywhere.' },
      { text: 'गोड़ लागी ती बड़ों का आदर', meaning: 'Greeting elders with reverence brings lifelong wisdom and peace.' },
    ],
  },
};

// Generates 3 Sections with 8 Units each (~24 Units total)
export const getCurriculumSections = (languageId: string): Section[] => {
  const langKey = languageId in LANGUAGE_CURRICULUM_DATA ? languageId : 'mundari';
  const meta = LANGUAGE_CURRICULUM_DATA[langKey];

  const sectionConfigs = [
    {
      sectionNumber: 1,
      title: 'Section 1: Foundations & Daily Village Life',
      subtitle: '8 Units • Everyday Speech, Kinship & Sacred Nature',
      description: 'Master everyday greetings, family terms, polite requests, and core tribal vocabulary.',
      unitThemes: [
        { title: 'Simple Greetings & Reverence', desc: 'Learn traditional respectful greetings, asking how someone is doing, and polite salutations.' },
        { title: 'Kinship, Elders & Family Hearth', desc: 'Identify parents, siblings, grandparents, and the warmth of the home hearth.' },
        { title: 'Sacred Nature, Forest & Streams', desc: 'Words for sacred trees, forest rivers, rain, and reverence for mother earth.' },
        { title: 'Village Food, Harvest & Fellowship', desc: 'Traditional meals, shared hospitality, and dining customs with guests.' },
        { title: 'Native Script & Sound Harmony', desc: 'Discover letter glyphs, phonetic vowels, and the script of your ancestors.' },
        { title: 'Numbers, Natural Time & Cycles', desc: 'Count everyday items, learn days, time expressions, and sunrise cycles.' },
        { title: 'Animals, Birds & Mother Earth', desc: 'Names of forest animals, domestic companions, and woodland birds.' },
        { title: 'Celebrations, Songs & Section Finale', desc: 'Spring festival songs, sacred circle dances, and Section 1 Mastery review.' },
      ],
    },
    {
      sectionNumber: 2,
      title: 'Section 2: Conversational Fluency & Living Culture',
      subtitle: '8 Units • Market Exchange, Folklore & Seasonal Rhythms',
      description: 'Engage in lively conversations, traditional village markets, music, and seasonal celebrations.',
      unitThemes: [
        { title: 'Market Days & Weekly Bazaar', desc: 'Buying fresh produce, asking prices, and bartering in rural haat bazaars.' },
        { title: 'Traditional Attire & Sacred Weaving', desc: 'Names of tribal handloom fabrics, waistcloths, and celebratory ornaments.' },
        { title: 'Monsoon, Agriculture & Sowing', desc: 'Plowing fields, monsoon clouds, planting seedlings, and welcoming rain.' },
        { title: 'Oral Folklore & Legendary Heroes', desc: 'Stories of freedom fighters (Birsa Munda, Sido-Kanhu) and ancestral folklore.' },
        { title: 'Folk Instruments & Sacred Rhythms', desc: 'The thunderous Tamak, Dumang drum, and gentle bamboo flutes.' },
        { title: 'Sacred Groves & Community Sarna', desc: 'Spiritual places of worship, priest blessings, and divine presence in nature.' },
        { title: 'Herbal Healing & Forest Wellness', desc: 'Traditional remedies, neem leaves, medicinal roots, and holistic wellness.' },
        { title: 'Community Harmony & Conversational Crown', desc: 'Complete fluent dialogues and conquer the Section 2 Trophy Checkpoint.' },
      ],
    },
    {
      sectionNumber: 3,
      title: 'Section 3: Community Lore, Philosophy & Wisdom',
      subtitle: '8 Units • Proverbs, Village Governance & Tribal Philosophy',
      description: 'Deepen your mastery with ancient proverbs, customary village councils, and living oral literature.',
      unitThemes: [
        { title: 'Ancient Proverbs & Folk Riddles', desc: 'Philosophical sayings and wit passed down by village grandmothers.' },
        { title: 'Village Governance & The Council', desc: 'Traditional Munda, Pahan, and Parha councils resolving conflicts in peace.' },
        { title: 'Courtship, Weddings & Clan Bonds', desc: 'Ceremonial customs, respectful matchmaking, and joyous wedding songs.' },
        { title: 'Traditional Architecture & Clay Murals', desc: 'Building earthen walls, Sohrai wall paintings, and thatched verandas.' },
        { title: 'Indigenous Astronomy & Star Legends', desc: 'Reading the night sky, constellations, and seasons by the stellar clock.' },
        { title: 'Oral Epics & Living Chants', desc: 'Creation myths, migration sagas, and poetic verses of the ancestors.' },
        { title: 'Environmental Harmony & Sacred Ethos', desc: 'Deep ecological wisdom, wildlife treaties, and living without greed.' },
        { title: 'Vanisetu Cultural Ambassador Certificate', desc: 'The ultimate mastery review celebrating your preservation of tribal heritage!' },
      ],
    },
  ];

  const mascots = [
    { name: 'Titiya Bird', avatar: '🐦', quote: 'Johar! Every word you learn keeps our heritage alive!' },
    { name: 'Shanti', avatar: '👵🏽', quote: 'Family and elders are the sheltering branches of our village.' },
    { name: 'Birsa', avatar: '🏹', quote: 'The forest and soil belong to those who nurture them with love.' },
    { name: 'Gora', avatar: '🧑🏽', quote: 'A guest arriving at our door is honored with sweet fresh water.' },
    { name: 'Baha', avatar: '🌺', quote: 'Our script sings like birds calling across the morning sal trees.' },
    { name: 'Soma', avatar: '🌾', quote: 'Count your blessings like the harvest grains in autumn.' },
    { name: 'Manki', avatar: '🧓🏽', quote: 'Listen closely to the wisdom in the songs of the elders.' },
    { name: 'Chief', avatar: '👑', quote: 'Splendid! You have earned the crown of tribal cultural mastery!' },
  ];

  return sectionConfigs.map((secConf) => {
    const secId = `${langKey}_sec_${secConf.sectionNumber}`;

    const units: Unit[] = secConf.unitThemes.map((uTheme, uIdx) => {
      const uNumber = uIdx + 1;
      const unitId = `${secId}_u${uNumber}`;
      const color = THEME_CYCLE[uIdx % THEME_CYCLE.length];
      const mascot = mascots[uIdx % mascots.length];
      const phrases = meta.samplePhrases[uIdx % meta.samplePhrases.length] || meta.samplePhrases[0];
      const proverb = meta.proverbs[uIdx % meta.proverbs.length] || meta.proverbs[0];
      const scriptChar = meta.scriptChars[uIdx % meta.scriptChars.length] || meta.scriptChars[0];

      // Existing verified lessons mapped to Section 1 Units 1-3
      let lesson1Id = `${langKey}_s${secConf.sectionNumber}_u${uNumber}_l1`;
      let lesson2Id = `${langKey}_s${secConf.sectionNumber}_u${uNumber}_l2`;
      let trophyId = `${langKey}_s${secConf.sectionNumber}_u${uNumber}_trophy`;

      if (secConf.sectionNumber === 1) {
        if (uNumber === 1) {
          lesson1Id = langKey === 'mundari' ? 'mun_l1' : langKey === 'santali' ? 'san_l1' : langKey === 'ho' ? 'ho_l1' : 'kur_l1';
          lesson2Id = langKey === 'mundari' ? 'mun_l2' : langKey === 'santali' ? 'san_l2' : langKey === 'ho' ? 'ho_l2' : 'kur_l2';
        } else if (uNumber === 2) {
          lesson1Id = langKey === 'mundari' ? 'mun_l3' : langKey === 'santali' ? 'san_l3' : langKey === 'ho' ? 'ho_l3' : 'kur_l3';
        }
      }

      const nodes: PathNode[] = [
        {
          nodeId: `${unitId}_n1`,
          unitId,
          type: 'lesson',
          title: `Lesson 1: ${uTheme.title.split('&')[0].trim()}`,
          description: 'Introduce core vocabulary and practice greetings with interactive scaffolding.',
          lessonId: lesson1Id,
          xpReward: 20,
          order: 1,
        },
        {
          nodeId: `${unitId}_n2`,
          unitId,
          type: 'script',
          title: `Script Practice: "${scriptChar}"`,
          description: `Learn the sound, writing strokes, and native recognition for glyph "${scriptChar}".`,
          scriptChar,
          xpReward: 15,
          order: 2,
        },
        {
          nodeId: `${unitId}_n3`,
          unitId,
          type: 'chest',
          title: 'Milestone Treasure Chest',
          description: 'Open to claim +30 Bonus XP, Streak Shield, and an authentic ancestral proverb.',
          xpReward: 30,
          rewardChest: {
            xp: 30,
            title: `Unit ${uNumber} Wisdom Treasure`,
            proverb: proverb.text,
            culturalContext: proverb.meaning,
          },
          order: 3,
        },
        {
          nodeId: `${unitId}_n4`,
          unitId,
          type: 'lesson',
          title: `Lesson 2: Conversational Scaffolding`,
          description: 'Combine introduced words into complete phrases and comprehension exercises.',
          lessonId: lesson2Id,
          xpReward: 25,
          order: 4,
        },
        {
          nodeId: `${unitId}_n5`,
          unitId,
          type: 'trophy',
          title: `Unit ${uNumber} Mastery Trophy`,
          description: 'Review all unit vocabulary and earn your unit completion crown!',
          lessonId: trophyId,
          xpReward: 35,
          order: 5,
        },
      ];

      return {
        unitId,
        sectionId: secId,
        unitNumber: uNumber,
        title: uTheme.title,
        subtitle: `Section ${secConf.sectionNumber} • Unit ${uNumber}`,
        description: uTheme.desc,
        themeColor: color,
        mascot,
        guidebookPhrases: phrases,
        nodes,
      };
    });

    return {
      sectionId: secId,
      sectionNumber: secConf.sectionNumber,
      title: secConf.title,
      subtitle: secConf.subtitle,
      description: secConf.description,
      units,
    };
  });
};
