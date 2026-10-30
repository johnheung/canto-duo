import { Lesson, Sentence, Unit, Word } from '@/lib/types';

// Course data. Jyutping uses tone numbers 1–6.
// NOTE: should be reviewed by a native Cantonese speaker before release.

function w(hanzi: string, jyutping: string, english: string, alt?: string[]): Word {
  return { id: hanzi, hanzi, jyutping, english, alt };
}

/** Tokens are `|`-separated in both hanzi and Jyutping, and must line up. */
function s(hanzi: string, jyutping: string, english: string, alt?: string[]): Sentence {
  const h = hanzi.split('|');
  const j = jyutping.split('|');
  if (h.length !== j.length) throw new Error(`Token mismatch in sentence ${hanzi}`);
  return {
    id: h.join(''),
    tokens: h.map((hanzi, i) => ({ hanzi, jyutping: j[i] })),
    english,
    alt,
  };
}

function lesson(id: string, title: string, words: Word[], sentences: Sentence[]): Lesson {
  return { id, title, words, sentences };
}

const rawUnits: Omit<Unit, 'index'>[] = [
  {
    id: 'u1',
    title: 'Greetings',
    hanziTitle: '問候',
    description: 'Say hello, introduce yourself and be polite.',
    color: '#14B8A6',
    lessons: [
      lesson(
        'u1-l1',
        'Hello',
        [
          w('你好', 'nei5 hou2', 'hello', ['hi']),
          w('早晨', 'zou2 san4', 'good morning'),
          w('拜拜', 'baai1 baai3', 'bye', ['goodbye', 'bye bye']),
          w('唔該', 'm4 goi1', 'thank you (for a service)', ['thanks', 'thank you', 'please', 'excuse me']),
          w('多謝', 'do1 ze6', 'thank you (for a gift)', ['thanks', 'thank you']),
        ],
        [
          s('多謝|你', 'do1 ze6|nei5', 'thank you'),
        ],
      ),
      lesson(
        'u1-l2',
        'People',
        [
          w('我', 'ngo5', 'I', ['me']),
          w('你', 'nei5', 'you'),
          w('佢', 'keoi5', 'he / she', ['he', 'she', 'him', 'her']),
          w('係', 'hai6', 'to be', ['is', 'am', 'are']),
          w('學生', 'hok6 saang1', 'student'),
        ],
        [
          s('我|係|學生', 'ngo5|hai6|hok6 saang1', 'I am a student'),
          s('佢|係|學生', 'keoi5|hai6|hok6 saang1', 'he is a student', ['she is a student']),
          s('你|係|學生', 'nei5|hai6|hok6 saang1', 'you are a student'),
        ],
      ),
      lesson(
        'u1-l3',
        'Names',
        [
          w('叫', 'giu3', 'to be called', ['call', 'called']),
          w('咩', 'me1', 'what'),
          w('名', 'meng2', 'name'),
          w('唔', 'm4', 'not', ['no']),
          w('好', 'hou2', 'good / very', ['good', 'very']),
        ],
        [
          s('你|叫|咩|名', 'nei5|giu3|me1|meng2', 'what is your name'),
          s('我|叫|阿明', 'ngo5|giu3|aa3 ming4', 'my name is Ming', ['I am called Ming']),
          s('我|唔|係|學生', 'ngo5|m4|hai6|hok6 saang1', 'I am not a student'),
        ],
      ),
      lesson(
        'u1-l4',
        'How are you?',
        [
          w('嗎', 'maa3', 'question particle'),
          w('幾', 'gei2', 'quite', ['pretty', 'fairly']),
          w('都', 'dou1', 'also', ['too']),
          w('呢', 'ne1', 'and…? (particle)', ['and you']),
          w('冇', 'mou5', "don't have", ['not have', 'no']),
        ],
        [
          s('你|好|嗎', 'nei5|hou2|maa3', 'how are you'),
          s('我|幾|好', 'ngo5|gei2|hou2', 'I am pretty good', ['I am quite good', 'I am quite well']),
          s('我|都|幾|好', 'ngo5|dou1|gei2|hou2', 'I am also pretty good', ['I am also quite good']),
          s('好耐|冇|見', 'hou2 noi6|mou5|gin3', 'long time no see'),
        ],
      ),
    ],
  },
  {
    id: 'u2',
    title: 'Numbers',
    hanziTitle: '數字',
    description: 'Count, ask how many and say big numbers.',
    color: '#F59E0B',
    lessons: [
      lesson(
        'u2-l1',
        'One to five',
        [
          w('一', 'jat1', 'one', ['1']),
          w('二', 'ji6', 'two', ['2']),
          w('三', 'saam1', 'three', ['3']),
          w('四', 'sei3', 'four', ['4']),
          w('五', 'ng5', 'five', ['5']),
        ],
        [
          s('一|二|三', 'jat1|ji6|saam1', 'one two three'),
          s('三|四|五', 'saam1|sei3|ng5', 'three four five'),
        ],
      ),
      lesson(
        'u2-l2',
        'Six to ten',
        [
          w('六', 'luk6', 'six', ['6']),
          w('七', 'cat1', 'seven', ['7']),
          w('八', 'baat3', 'eight', ['8']),
          w('九', 'gau2', 'nine', ['9']),
          w('十', 'sap6', 'ten', ['10']),
        ],
        [
          s('六|七|八', 'luk6|cat1|baat3', 'six seven eight'),
          s('十|五', 'sap6|ng5', 'fifteen', ['15']),
          s('二|十', 'ji6|sap6', 'twenty', ['20']),
        ],
      ),
      lesson(
        'u2-l3',
        'How many?',
        [
          w('兩', 'loeng5', 'two (of something)', ['two']),
          w('個', 'go3', 'measure word (general)', ['measure word']),
          w('幾多', 'gei2 do1', 'how many', ['how much']),
          w('有', 'jau5', 'to have', ['have', 'has', 'there is', 'there are']),
          w('人', 'jan4', 'person', ['people']),
        ],
        [
          s('有|幾多|個|人', 'jau5|gei2 do1|go3|jan4', 'how many people are there'),
          s('有|五|個|人', 'jau5|ng5|go3|jan4', 'there are five people'),
          s('我|有|兩|個', 'ngo5|jau5|loeng5|go3', 'I have two'),
        ],
      ),
      lesson(
        'u2-l4',
        'Big numbers',
        [
          w('零', 'ling4', 'zero', ['0']),
          w('半', 'bun3', 'half'),
          w('百', 'baak3', 'hundred'),
          w('千', 'cin1', 'thousand'),
          w('萬', 'maan6', 'ten thousand', ['10000']),
        ],
        [
          s('一|百', 'jat1|baak3', 'one hundred', ['100']),
          s('三|千', 'saam1|cin1', 'three thousand', ['3000']),
          s('兩|萬', 'loeng5|maan6', 'twenty thousand', ['20000']),
        ],
      ),
    ],
  },
  {
    id: 'u3',
    title: 'Food & Drink',
    hanziTitle: '飲食',
    description: 'Order drinks, eat dim sum and pay the bill.',
    color: '#EF4444',
    lessons: [
      lesson(
        'u3-l1',
        'Drinks',
        [
          w('水', 'seoi2', 'water'),
          w('茶', 'caa4', 'tea'),
          w('咖啡', 'gaa3 fe1', 'coffee'),
          w('奶茶', 'naai5 caa4', 'milk tea'),
          w('飲', 'jam2', 'to drink', ['drink']),
        ],
        [
          s('我|飲|茶', 'ngo5|jam2|caa4', 'I drink tea'),
          s('佢|飲|水', 'keoi5|jam2|seoi2', 'she drinks water', ['he drinks water']),
          s('你|飲|唔|飲|咖啡', 'nei5|jam2|m4|jam2|gaa3 fe1', 'do you drink coffee'),
        ],
      ),
      lesson(
        'u3-l2',
        'Food',
        [
          w('飯', 'faan6', 'rice', ['meal']),
          w('麵', 'min6', 'noodles'),
          w('雞', 'gai1', 'chicken'),
          w('魚', 'jyu4', 'fish'),
          w('食', 'sik6', 'to eat', ['eat']),
        ],
        [
          s('我|食|飯', 'ngo5|sik6|faan6', 'I eat rice', ['I eat a meal']),
          s('佢|食|麵', 'keoi5|sik6|min6', 'he eats noodles', ['she eats noodles']),
          s('你|食|唔|食|魚', 'nei5|sik6|m4|sik6|jyu4', 'do you eat fish'),
        ],
      ),
      lesson(
        'u3-l3',
        'At the restaurant',
        [
          w('要', 'jiu3', 'to want', ['want']),
          w('杯', 'bui1', 'cup', ['glass']),
          w('餐牌', 'caan1 paai2', 'menu'),
          w('好食', 'hou2 sik6', 'delicious', ['tasty']),
          w('埋單', 'maai4 daan1', 'the bill', ['bill', 'check']),
        ],
        [
          s('我|要|一|杯|茶', 'ngo5|jiu3|jat1|bui1|caa4', 'I want a cup of tea'),
          s('唔該|埋單', 'm4 goi1|maai4 daan1', 'the bill please', ['check please']),
          s('好|好食', 'hou2|hou2 sik6', 'very delicious'),
        ],
      ),
      lesson(
        'u3-l4',
        'Dim sum',
        [
          w('點心', 'dim2 sam1', 'dim sum'),
          w('蝦餃', 'haa1 gaau2', 'shrimp dumpling', ['har gow']),
          w('燒賣', 'siu1 maai2', 'siu mai', ['pork dumpling']),
          w('叉燒包', 'caa1 siu1 baau1', 'BBQ pork bun', ['char siu bao']),
          w('飲茶', 'jam2 caa4', 'yum cha', ['have dim sum']),
        ],
        [
          s('我|要|蝦餃', 'ngo5|jiu3|haa1 gaau2', 'I want shrimp dumplings'),
          s('點心|好|好食', 'dim2 sam1|hou2|hou2 sik6', 'dim sum is very delicious'),
          s('你|食|唔|食|燒賣', 'nei5|sik6|m4|sik6|siu1 maai2', 'do you eat siu mai'),
        ],
      ),
    ],
  },
  {
    id: 'u4',
    title: 'Family',
    hanziTitle: '屋企人',
    description: 'Talk about your family, friends and ages.',
    color: '#8B5CF6',
    lessons: [
      lesson(
        'u4-l1',
        'Parents & siblings',
        [
          w('爸爸', 'baa4 baa1', 'dad', ['father']),
          w('媽媽', 'maa4 maa1', 'mum', ['mom', 'mother']),
          w('哥哥', 'go4 go1', 'older brother'),
          w('家姐', 'gaa1 ze1', 'older sister'),
          w('屋企人', 'uk1 kei2 jan4', 'family', ['family members']),
        ],
        [
          s('佢|係|我|媽媽', 'keoi5|hai6|ngo5|maa4 maa1', 'she is my mum', ['she is my mom']),
          s('佢|係|我|爸爸', 'keoi5|hai6|ngo5|baa4 baa1', 'he is my dad'),
          s('我|有|一|個|家姐', 'ngo5|jau5|jat1|go3|gaa1 ze1', 'I have one older sister', ['I have an older sister']),
        ],
      ),
      lesson(
        'u4-l2',
        'Children',
        [
          w('細佬', 'sai3 lou2', 'younger brother'),
          w('細妹', 'sai3 mui2', 'younger sister'),
          w('仔', 'zai2', 'son'),
          w('女', 'neoi2', 'daughter'),
          w('屋企', 'uk1 kei2', 'home'),
        ],
        [
          s('我|有|兩|個|細佬', 'ngo5|jau5|loeng5|go3|sai3 lou2', 'I have two younger brothers'),
          s('佢|係|我|個|仔', 'keoi5|hai6|ngo5|go3|zai2', 'he is my son'),
          s('佢|係|我|個|女', 'keoi5|hai6|ngo5|go3|neoi2', 'she is my daughter'),
        ],
      ),
      lesson(
        'u4-l3',
        'Friends & partners',
        [
          w('朋友', 'pang4 jau5', 'friend'),
          w('老公', 'lou5 gung1', 'husband'),
          w('老婆', 'lou5 po4', 'wife'),
          w('男仔', 'naam4 zai2', 'boy'),
          w('女仔', 'neoi5 zai2', 'girl'),
        ],
        [
          s('佢|係|我|朋友', 'keoi5|hai6|ngo5|pang4 jau5', 'he is my friend', ['she is my friend']),
          s('佢|係|我|老婆', 'keoi5|hai6|ngo5|lou5 po4', 'she is my wife'),
          s('我|有|三|個|朋友', 'ngo5|jau5|saam1|go3|pang4 jau5', 'I have three friends'),
        ],
      ),
      lesson(
        'u4-l4',
        'Ages & jobs',
        [
          w('歲', 'seoi3', 'years old', ['age']),
          w('大', 'daai6', 'big / older', ['big', 'older']),
          w('細', 'sai3', 'small / younger', ['small', 'younger']),
          w('老師', 'lou5 si1', 'teacher'),
          w('醫生', 'ji1 sang1', 'doctor'),
        ],
        [
          s('你|幾多|歲', 'nei5|gei2 do1|seoi3', 'how old are you'),
          s('我|二|十|歲', 'ngo5|ji6|sap6|seoi3', 'I am twenty years old'),
          s('我|爸爸|係|老師', 'ngo5|baa4 baa1|hai6|lou5 si1', 'my dad is a teacher'),
          s('我|媽媽|係|醫生', 'ngo5|maa4 maa1|hai6|ji1 sang1', 'my mum is a doctor', ['my mom is a doctor']),
        ],
      ),
    ],
  },
  {
    id: 'u5',
    title: 'Time',
    hanziTitle: '時間',
    description: 'Days, dates and telling the time.',
    color: '#3B82F6',
    lessons: [
      lesson(
        'u5-l1',
        'Today & tomorrow',
        [
          w('今日', 'gam1 jat6', 'today'),
          w('聽日', 'ting1 jat6', 'tomorrow'),
          w('琴日', 'kam4 jat6', 'yesterday'),
          w('而家', 'ji4 gaa1', 'now'),
          w('見', 'gin3', 'to see', ['see', 'meet']),
        ],
        [
          s('聽日|見', 'ting1 jat6|gin3', 'see you tomorrow'),
          s('我|而家|食|飯', 'ngo5|ji4 gaa1|sik6|faan6', 'I am eating now'),
          s('琴日|我|食|麵', 'kam4 jat6|ngo5|sik6|min6', 'yesterday I ate noodles'),
        ],
      ),
      lesson(
        'u5-l2',
        'Telling the time',
        [
          w('點', 'dim2', "o'clock", ['oclock', 'hour']),
          w('分鐘', 'fan1 zung1', 'minute', ['minutes']),
          w('時間', 'si4 gaan3', 'time'),
          w('早', 'zou2', 'early'),
          w('夜', 'je6', 'late / night', ['late', 'night']),
        ],
        [
          s('而家|幾|點', 'ji4 gaa1|gei2|dim2', 'what time is it now'),
          s('而家|三|點', 'ji4 gaa1|saam1|dim2', "it is three o'clock now"),
          s('三|點|半', 'saam1|dim2|bun3', 'half past three'),
        ],
      ),
      lesson(
        'u5-l3',
        'Days of the week',
        [
          w('星期', 'sing1 kei4', 'week'),
          w('星期一', 'sing1 kei4 jat1', 'Monday'),
          w('星期五', 'sing1 kei4 ng5', 'Friday'),
          w('星期日', 'sing1 kei4 jat6', 'Sunday'),
          w('週末', 'zau1 mut6', 'weekend'),
        ],
        [
          s('今日|係|星期一', 'gam1 jat6|hai6|sing1 kei4 jat1', 'today is Monday'),
          s('聽日|係|星期日', 'ting1 jat6|hai6|sing1 kei4 jat6', 'tomorrow is Sunday'),
          s('琴日|係|星期五', 'kam4 jat6|hai6|sing1 kei4 ng5', 'yesterday was Friday'),
        ],
      ),
      lesson(
        'u5-l4',
        'Dates',
        [
          w('月', 'jyut6', 'month'),
          w('年', 'nin4', 'year'),
          w('號', 'hou6', 'day of the month', ['date']),
          w('生日', 'saang1 jat6', 'birthday'),
          w('快樂', 'faai3 lok6', 'happy'),
        ],
        [
          s('生日|快樂', 'saang1 jat6|faai3 lok6', 'happy birthday'),
          s('今日|係|五|月|三|號', 'gam1 jat6|hai6|ng5|jyut6|saam1|hou6', 'today is May third', ['today is the third of May']),
          s('我|生日|係|八|月', 'ngo5|saang1 jat6|hai6|baat3|jyut6', 'my birthday is in August'),
        ],
      ),
    ],
  },
  {
    id: 'u6',
    title: 'Getting Around',
    hanziTitle: '交通',
    description: 'Ask where things are, take the MTR and give directions.',
    color: '#10B981',
    lessons: [
      lesson(
        'u6-l1',
        'Where?',
        [
          w('喺', 'hai2', 'at / in', ['at', 'in']),
          w('邊度', 'bin1 dou6', 'where'),
          w('呢度', 'ni1 dou6', 'here'),
          w('嗰度', 'go2 dou6', 'there'),
          w('去', 'heoi3', 'to go', ['go']),
        ],
        [
          s('你|去|邊度', 'nei5|heoi3|bin1 dou6', 'where are you going'),
          s('我|喺|呢度', 'ngo5|hai2|ni1 dou6', 'I am here'),
          s('佢|喺|嗰度', 'keoi5|hai2|go2 dou6', 'he is there', ['she is there']),
        ],
      ),
      lesson(
        'u6-l2',
        'Places',
        [
          w('廁所', 'ci3 so2', 'toilet', ['bathroom', 'restroom']),
          w('餐廳', 'caan1 teng1', 'restaurant'),
          w('學校', 'hok6 haau6', 'school'),
          w('車站', 'ce1 zaam6', 'station'),
          w('銀行', 'ngan4 hong4', 'bank'),
        ],
        [
          s('廁所|喺|邊度', 'ci3 so2|hai2|bin1 dou6', 'where is the toilet', ['where is the bathroom']),
          s('我|去|學校', 'ngo5|heoi3|hok6 haau6', 'I go to school'),
          s('銀行|喺|嗰度', 'ngan4 hong4|hai2|go2 dou6', 'the bank is there'),
        ],
      ),
      lesson(
        'u6-l3',
        'Transport',
        [
          w('地鐵', 'dei6 tit3', 'MTR / subway', ['MTR', 'subway', 'metro']),
          w('巴士', 'baa1 si2', 'bus'),
          w('的士', 'dik1 si2', 'taxi'),
          w('搭', 'daap3', 'to take (transport)', ['take', 'ride']),
          w('行路', 'haang4 lou6', 'to walk', ['walk']),
        ],
        [
          s('我|搭|地鐵', 'ngo5|daap3|dei6 tit3', 'I take the MTR', ['I take the subway']),
          s('佢|搭|的士', 'keoi5|daap3|dik1 si2', 'she takes a taxi', ['he takes a taxi']),
          s('我|行路|去|學校', 'ngo5|haang4 lou6|heoi3|hok6 haau6', 'I walk to school'),
        ],
      ),
      lesson(
        'u6-l4',
        'Directions',
        [
          w('左', 'zo2', 'left'),
          w('右', 'jau6', 'right'),
          w('轉', 'zyun3', 'to turn', ['turn']),
          w('直行', 'zik6 haang4', 'go straight', ['straight']),
          w('遠', 'jyun5', 'far'),
        ],
        [
          s('左|轉', 'zo2|zyun3', 'turn left'),
          s('右|轉', 'jau6|zyun3', 'turn right'),
          s('學校|好|遠', 'hok6 haau6|hou2|jyun5', 'the school is very far'),
        ],
      ),
    ],
  },
  {
    id: 'u7',
    title: 'Shopping',
    hanziTitle: '買嘢',
    description: 'Prices, bargains, clothes and colours.',
    color: '#EC4899',
    lessons: [
      lesson(
        'u7-l1',
        'How much?',
        [
          w('買', 'maai5', 'to buy', ['buy']),
          w('錢', 'cin2', 'money'),
          w('蚊', 'man1', 'dollars', ['dollar']),
          w('幾錢', 'gei2 cin2', 'how much (money)', ['how much']),
          w('呢個', 'ni1 go3', 'this one', ['this']),
        ],
        [
          s('呢個|幾錢', 'ni1 go3|gei2 cin2', 'how much is this'),
          s('五|十|蚊', 'ng5|sap6|man1', 'fifty dollars'),
          s('我|要|呢個', 'ngo5|jiu3|ni1 go3', 'I want this one'),
        ],
      ),
      lesson(
        'u7-l2',
        'Bargaining',
        [
          w('平', 'peng4', 'cheap'),
          w('貴', 'gwai3', 'expensive'),
          w('太', 'taai3', 'too'),
          w('啲', 'di1', 'a bit', ['a little']),
          w('得', 'dak1', 'OK / can', ['ok', 'can']),
        ],
        [
          s('太|貴|喇', 'taai3|gwai3|laa3', 'too expensive'),
          s('呢個|好|平', 'ni1 go3|hou2|peng4', 'this one is very cheap'),
          s('平|啲|得|唔|得', 'peng4|di1|dak1|m4|dak1', 'can it be a bit cheaper'),
        ],
      ),
      lesson(
        'u7-l3',
        'Clothes',
        [
          w('衫', 'saam1', 'shirt / clothes', ['shirt', 'clothes', 'top']),
          w('褲', 'fu3', 'trousers', ['pants']),
          w('鞋', 'haai4', 'shoes'),
          w('着', 'zoek3', 'to wear', ['wear']),
          w('件', 'gin6', 'measure word (clothes)', ['measure word']),
        ],
        [
          s('我|買|一|件|衫', 'ngo5|maai5|jat1|gin6|saam1', 'I buy a shirt'),
          s('我|着|鞋', 'ngo5|zoek3|haai4', 'I wear shoes'),
          s('呢|對|鞋|好|貴', 'ni1|deoi3|haai4|hou2|gwai3', 'these shoes are very expensive'),
        ],
      ),
      lesson(
        'u7-l4',
        'Colours',
        [
          w('紅色', 'hung4 sik1', 'red'),
          w('藍色', 'laam4 sik1', 'blue'),
          w('黑色', 'hak1 sik1', 'black'),
          w('白色', 'baak6 sik1', 'white'),
          w('顏色', 'ngaan4 sik1', 'colour', ['color']),
        ],
        [
          s('我|要|紅色', 'ngo5|jiu3|hung4 sik1', 'I want red'),
          s('呢|件|衫|係|藍色', 'ni1|gin6|saam1|hai6|laam4 sik1', 'this shirt is blue'),
          s('你|鍾意|咩|顏色', 'nei5|zung1 ji3|me1|ngaan4 sik1', 'what colour do you like', ['what color do you like']),
        ],
      ),
    ],
  },
  {
    id: 'u8',
    title: 'Daily Life',
    hanziTitle: '日常生活',
    description: 'Routines, weather and how you feel.',
    color: '#F97316',
    lessons: [
      lesson(
        'u8-l1',
        'Likes & wants',
        [
          w('鍾意', 'zung1 ji3', 'to like', ['like']),
          w('想', 'soeng2', 'to want to', ['want', 'would like']),
          w('做', 'zou6', 'to do', ['do']),
          w('睇', 'tai2', 'to watch / look', ['watch', 'look', 'see']),
          w('返工', 'faan1 gung1', 'to go to work', ['go to work', 'work']),
        ],
        [
          s('我|鍾意|飲|茶', 'ngo5|zung1 ji3|jam2|caa4', 'I like drinking tea', ['I like to drink tea']),
          s('我|想|睇戲', 'ngo5|soeng2|tai2 hei3', 'I want to watch a movie'),
          s('你|做|緊|乜嘢', 'nei5|zou6|gan2|mat1 je5', 'what are you doing'),
        ],
      ),
      lesson(
        'u8-l2',
        'Routine',
        [
          w('起身', 'hei2 san1', 'to get up', ['get up', 'wake up']),
          w('沖涼', 'cung1 loeng4', 'to shower', ['shower', 'take a shower']),
          w('瞓覺', 'fan3 gaau3', 'to sleep', ['sleep']),
          w('返屋企', 'faan1 uk1 kei2', 'to go home', ['go home']),
          w('攰', 'gui6', 'tired'),
        ],
        [
          s('我|好|攰', 'ngo5|hou2|gui6', 'I am very tired'),
          s('我|想|瞓覺', 'ngo5|soeng2|fan3 gaau3', 'I want to sleep'),
          s('我|七|點|起身', 'ngo5|cat1|dim2|hei2 san1', "I get up at seven o'clock"),
        ],
      ),
      lesson(
        'u8-l3',
        'Weather',
        [
          w('天氣', 'tin1 hei3', 'weather'),
          w('熱', 'jit6', 'hot'),
          w('凍', 'dung3', 'cold'),
          w('落雨', 'lok6 jyu5', 'to rain', ['rain', 'raining']),
          w('會', 'wui5', 'will'),
        ],
        [
          s('今日|好|熱', 'gam1 jat6|hou2|jit6', 'it is very hot today', ['today is very hot']),
          s('聽日|會|落雨', 'ting1 jat6|wui5|lok6 jyu5', 'it will rain tomorrow'),
          s('今日|天氣|好|好', 'gam1 jat6|tin1 hei3|hou2|hou2', 'the weather is very good today'),
        ],
      ),
      lesson(
        'u8-l4',
        'Feelings',
        [
          w('開心', 'hoi1 sam1', 'happy'),
          w('肚餓', 'tou5 ngo6', 'hungry'),
          w('頸渴', 'geng2 hot3', 'thirsty'),
          w('冇問題', 'mou5 man6 tai4', 'no problem'),
          w('加油', 'gaa1 jau2', 'keep going!', ['keep going', 'you can do it', 'come on']),
        ],
        [
          s('我|好|開心', 'ngo5|hou2|hoi1 sam1', 'I am very happy'),
          s('我|好|肚餓', 'ngo5|hou2|tou5 ngo6', 'I am very hungry'),
          s('你|頸渴|嗎', 'nei5|geng2 hot3|maa3', 'are you thirsty'),
        ],
      ),
    ],
  },
];

export const units: Unit[] = rawUnits.map((u, index) => ({ ...u, index }));
