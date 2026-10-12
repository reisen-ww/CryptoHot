// 这个行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（教程、观点）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  { key: "crypto-market", label: "加密市场", feedLabel: "加密货币市场", section: "加密货币", guide: "主流币的价格与行情异动、ETF 资金流、机构持仓与入场、交易所经营与上币、链上大额转账和清算。协议本身的技术升级或安全事件归 DeFi 链上；牌照、立法和诉讼归加密监管。" },
  { key: "crypto-defi", label: "DeFi 链上", feedLabel: "DeFi 与链上", section: "加密货币", guide: "DeFi 协议、Layer2、新公链、跨链桥、稳定币机制以及链上技术升级、黑客攻击、漏洞、审计和治理。价格和资金流本身归加密市场；被监管处罚的结论归加密监管。" },
  { key: "crypto-policy", label: "加密监管", feedLabel: "加密监管", section: "政策与宏观", guide: "各国监管机构对加密资产的定性、立法、牌照、执法与诉讼、税收与合规要求，以及行业就此的表态。面向整个金融体系的货币政策归宏观。" },
  { key: "stock-us", label: "美股", feedLabel: "美股", section: "股票市场", guide: "美股个股与财报、指引、回购分红、IPO 与上市、指数与板块表现、机构增减持和分析师评级调整。中概股和港股归 A股港股；宏观数据本身归宏观。" },
  { key: "stock-cn", label: "A股港股", feedLabel: "A股与港股", section: "股票市场", guide: "A 股和港股的行情、北向与南向资金、中概股、上市公司公告、停复牌、退市与新股发行。宏观政策与利率归宏观。" },
  { key: "stock-asia-tech", label: "日韩台科技股", feedLabel: "日韩台科技股", section: "股票市场", guide: "日本、韩国、台湾上市公司的行情、财报与指引、资本开支、产能与涨价、股东回报和公司治理，尤其是半导体、面板、电池、被动元件与电子代工这些科技制造环节。美股（含中概股 ADR）归美股；A 股和港股归 A股港股；所在国的货币政策、汇率和宏观数据归宏观。" },
  { key: "macro", label: "宏观", feedLabel: "宏观", section: "政策与宏观", guide: "央行与财政的政策、利率决议、通胀与就业数据、汇率、大宗商品、国债与流动性、经济预测和机构对宏观的判断。只针对加密资产的监管归加密监管。" },
  { key: "funding", label: "融资并购", feedLabel: "融资并购", section: "行业动态", guide: "一级市场融资、估值、代币发行与空投、并购重组、战略合作、破产清算与重组、关键人事变动。二级市场的股价和财报归对应的股票类别。" },
  { key: "opinion", label: "观点", feedLabel: "观点", section: "观点与教程", guide: "重点是作者的解释、判断、预测、评论、访谈或深度分析，没有可照做的操作步骤。转述一条新闻不因此变成观点；有具体做法的归教程。", commentary: true },
  { key: "tip", label: "教程", feedLabel: "教程", section: "观点与教程", guide: "读者可以照着使用的操作方法、工具用法、交易与风控实践、链上查询和避坑指南，以及面向从业者的技术讲解。只发布一个产品归行业动态，只有态度和预测而无做法归观点。", commentary: true },
] as const satisfies ReadonlyArray<{ key: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（如 AI 行业的新模型）：日报报头的“N 个新模型”、改分类后修订已出的报告都按它数。
 * category 是类别，tag 是标签，两者都对上才算；unit 接在数字后面。
 * 没有这样一类的行业设成 null，报头就不显示这个数。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = null;

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = ["btc", "eth", "etf", "ipo", "api", "ceo", "cfo", "gdp", "cpi", "usd", "ai"];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["model_release", "product_launch", "tool_or_prompt", "research_paper", "industry_event", "opinion_analysis", "tutorial_explainer"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "行情异动", "财报", "监管处罚", "安全事件", "产品上线", "融资", "并购",
  "数据发布", "政策发布", "会议讲话", "研究报告", "破产清算", "合作",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "比特币", "以太坊", "稳定币", "ETF", "DeFi", "Layer2", "交易所",
  "美联储", "利率", "通胀", "半导体", "中概股", "港股", "人民币汇率", "大宗商品",
] as const;

/** 可选的实体标签（公司、机构、平台）。 */
export const ENTITY_TAGS = ["Bitcoin", "Ethereum", "Solana", "Binance", "Coinbase", "SEC", "美联储", "NVIDIA", "Apple", "Microsoft", "Tesla", "Google", "Meta", "Amazon"] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  价格异动: "行情异动", 大涨: "行情异动", 大跌: "行情异动", 行情: "行情异动", 价格: "行情异动", 清算: "行情异动", 资金流: "行情异动",
  业绩: "财报", 季报: "财报", 年报: "财报", 财务: "财报", earnings: "财报",
  监管: "监管处罚", 处罚: "监管处罚", 执法: "监管处罚", 诉讼: "监管处罚", 罚款: "监管处罚", 起诉: "监管处罚",
  黑客: "安全事件", 被盗: "安全事件", 漏洞: "安全事件", 攻击: "安全事件", 审计: "安全事件", 脱锚: "安全事件",
  产品发布: "产品上线", 上线: "产品上线", 发布: "产品上线", 升级: "产品上线", 主网上线: "产品上线",
  融资并购: "融资", 投资: "融资", 募资: "融资", 估值: "融资", 空投: "融资", 代币发行: "融资", ico: "融资",
  收购: "并购", 合并: "并购", 重组: "并购", 战略合作: "合作", 合作: "合作", 生态: "合作", 集成: "合作",
  数据: "数据发布", 经济数据: "数据发布", 月度数据: "数据发布", 通胀数据: "数据发布",
  政策: "政策发布", 法规: "政策发布", 立法: "政策发布", 法案: "政策发布", 决议: "政策发布",
  讲话: "会议讲话", 演讲: "会议讲话", 访谈: "会议讲话", 听证会: "会议讲话", 发布会: "会议讲话",
  研究: "研究报告", 报告: "研究报告", 分析: "研究报告", paper: "研究报告", research: "研究报告",
  破产: "破产清算", 清算重组: "破产清算", 退市: "破产清算", 停运: "破产清算", 倒闭: "破产清算",
  bitcoin: "Bitcoin", btc: "Bitcoin", ethereum: "Ethereum", eth: "Ethereum", solana: "Solana", sol: "Solana",
  binance: "Binance", coinbase: "Coinbase", sec: "SEC", fed: "美联储", 联储: "美联储", nvidia: "NVIDIA", 英伟达: "NVIDIA",
  apple: "Apple", 苹果: "Apple", microsoft: "Microsoft", 微软: "Microsoft", tesla: "Tesla", 特斯拉: "Tesla",
  google: "Google", 谷歌: "Google", meta: "Meta", amazon: "Amazon", 亚马逊: "Amazon",
  稳定币: "稳定币", 加密货币: "比特币", 数字货币: "比特币", 虚拟货币: "比特币",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；otherNames 是公司自己的其他称呼（官方账号名、子品牌），
 * 把事实的主体对到发布方时也认它们。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; otherNames?: string[] }> = {
  bitcoin: { name: "Bitcoin", displayTag: "Bitcoin", aliases: ["Bitcoin", "BTC", "比特币", "比特幣"], otherNames: ["Bitcoin Core", "Bitcoin Network"] },
  ethereum: { name: "Ethereum", displayTag: "Ethereum", aliases: ["Ethereum", "ETH", "以太坊", "以太币"], otherNames: ["Ethereum Foundation", "以太坊基金会"] },
  solana: { name: "Solana", displayTag: "Solana", aliases: ["Solana", "SOL", "索拉纳"], otherNames: ["Solana Foundation", "Solana Labs"] },
  ripple: { name: "Ripple", displayTag: null, aliases: ["Ripple", "XRP", "瑞波"], otherNames: ["Ripple Labs"] },
  cardano: { name: "Cardano", displayTag: null, aliases: ["Cardano", "ADA", "艾达币"], otherNames: ["Input Output", "IOHK"] },
  "bnb-chain": { name: "BNB Chain", displayTag: null, aliases: ["BNB Chain", "BNB", "BSC", "Binance Smart Chain", "币安链"] },
  ton: { name: "TON", displayTag: null, aliases: ["TON", "Toncoin", "The Open Network"], otherNames: ["TON Foundation"] },
  uniswap: { name: "Uniswap", displayTag: null, aliases: ["Uniswap", "UNI"], otherNames: ["Uniswap Labs"] },
  aave: { name: "Aave", displayTag: null, aliases: ["Aave", "AAVE"] },
  lido: { name: "Lido", displayTag: null, aliases: ["Lido", "LDO", "Lido Finance"] },
  makerdao: { name: "MakerDAO", displayTag: null, aliases: ["MakerDAO", "MKR", "Maker Protocol"], otherNames: ["Sky", "Sky Protocol"] },
  chainlink: { name: "Chainlink", displayTag: null, aliases: ["Chainlink", "LINK"], otherNames: ["Chainlink Labs"] },
  tether: { name: "Tether", displayTag: null, aliases: ["Tether", "USDT"], otherNames: ["Tether Holdings"] },
  circle: { name: "Circle", displayTag: null, aliases: ["Circle", "USDC"], otherNames: ["Circle Internet Group", "Circle Internet Financial"] },
  binance: { name: "Binance", displayTag: "Binance", aliases: ["Binance", "币安"], otherNames: ["Binance Labs", "Binance Research", "Binance Academy"] },
  coinbase: { name: "Coinbase", displayTag: "Coinbase", aliases: ["Coinbase", "COIN"], otherNames: ["Coinbase Global", "Coinbase Asset Management"] },
  okx: { name: "OKX", displayTag: null, aliases: ["OKX", "欧易", "OKEx"], otherNames: ["OKX Ventures"] },
  bybit: { name: "Bybit", displayTag: null, aliases: ["Bybit"] },
  kraken: { name: "Kraken", displayTag: null, aliases: ["Kraken", "Payward"] },
  bitfinex: { name: "Bitfinex", displayTag: null, aliases: ["Bitfinex"] },
  gemini: { name: "Gemini", displayTag: null, aliases: ["Gemini", "Gemini Trust"] },
  robinhood: { name: "Robinhood", displayTag: null, aliases: ["Robinhood", "HOOD"] },
  microstrategy: { name: "MicroStrategy", displayTag: null, aliases: ["MicroStrategy", "MSTR", "微策略"], otherNames: ["Strategy", "Strategy Inc"] },
  blackrock: { name: "BlackRock", displayTag: null, aliases: ["BlackRock", "贝莱德", "BLK"], otherNames: ["iShares"] },
  fidelity: { name: "Fidelity", displayTag: null, aliases: ["Fidelity", "富达"], otherNames: ["Fidelity Investments", "Fidelity Digital Assets"] },
  grayscale: { name: "Grayscale", displayTag: null, aliases: ["Grayscale", "灰度"], otherNames: ["Grayscale Investments"] },
  sec: { name: "SEC", displayTag: "SEC", aliases: ["SEC", "美国证券交易委员会", "U.S. Securities and Exchange Commission", "美证监会"] },
  cftc: { name: "CFTC", displayTag: null, aliases: ["CFTC", "美国商品期货交易委员会", "Commodity Futures Trading Commission"] },
  fed: { name: "美联储", displayTag: "美联储", aliases: ["美联储", "联储", "Federal Reserve", "Fed", "FOMC"], otherNames: ["Federal Open Market Committee", "联邦公开市场委员会"] },
  ecb: { name: "欧洲央行", displayTag: null, aliases: ["欧洲央行", "欧洲中央银行", "ECB", "European Central Bank"] },
  pboc: { name: "中国人民银行", displayTag: null, aliases: ["中国人民银行", "人民银行", "中国央行", "PBOC"], otherNames: ["国家外汇管理局"] },
  csrc: { name: "中国证监会", displayTag: null, aliases: ["中国证监会", "证监会", "CSRC"] },
  "sfc-hk": { name: "香港证监会", displayTag: null, aliases: ["香港证监会", "SFC", "香港证券及期货事务监察委员会"] },
  treasury: { name: "美国财政部", displayTag: null, aliases: ["美国财政部", "美财政部", "财政部", "U.S. Treasury", "Treasury"], otherNames: ["OFAC", "海外资产控制办公室"] },
  nvidia: { name: "NVIDIA", displayTag: "NVIDIA", aliases: ["NVIDIA", "英伟达", "NVDA"] },
  apple: { name: "Apple", displayTag: "Apple", aliases: ["Apple", "苹果", "AAPL"] },
  microsoft: { name: "Microsoft", displayTag: "Microsoft", aliases: ["Microsoft", "微软", "MSFT"] },
  tesla: { name: "Tesla", displayTag: "Tesla", aliases: ["Tesla", "特斯拉", "TSLA"] },
  google: { name: "Google", displayTag: "Google", aliases: ["Google", "谷歌", "Alphabet", "GOOGL", "GOOG"], otherNames: ["Google Cloud", "DeepMind"] },
  meta: { name: "Meta", displayTag: "Meta", aliases: ["Meta", "Facebook", "脸书", "META"], otherNames: ["Meta Platforms"] },
  amazon: { name: "Amazon", displayTag: "Amazon", aliases: ["Amazon", "亚马逊", "AMZN"], otherNames: ["AWS", "Amazon Web Services"] },
  tsmc: { name: "台积电", displayTag: null, aliases: ["台积电", "TSMC", "台湾积体电路制造", "2330.TW"] },
};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 行业没有这个问题时可以留空数组。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "bitcoin", name: "Bitcoin", patterns: [/\bbitcoin\b|\bbtc\b|比特币/i] },
  { id: "ethereum", name: "Ethereum", patterns: [/\bethereum\b|\bether\b|\beth\b|以太坊|以太币/i] },
  { id: "solana", name: "Solana", patterns: [/\bsolana\b|\bsol\b/i] },
  { id: "ripple", name: "Ripple", patterns: [/\bripple\b|\bxrp\b|瑞波/i] },
  { id: "cardano", name: "Cardano", patterns: [/\bcardano\b|\bada\b/i] },
  { id: "bnb-chain", name: "BNB Chain", patterns: [/\bbnb\b|\bbsc\b|binance\s+smart\s+chain|币安链/i] },
  { id: "ton", name: "TON", patterns: [/\btoncoin\b|\bTON\b|the\s+open\s+network/] },
  { id: "uniswap", name: "Uniswap", patterns: [/\buniswap\b|\bUNI\b/] },
  { id: "aave", name: "Aave", patterns: [/\baave\b/i] },
  { id: "lido", name: "Lido", patterns: [/\blido\b|\bLDO\b/] },
  { id: "makerdao", name: "MakerDAO", patterns: [/\bmakerdao\b|\bmaker\s+protocol\b|\bMKR\b/] },
  { id: "chainlink", name: "Chainlink", patterns: [/chainlink|\bLINK\b/] },
  { id: "tether", name: "Tether", patterns: [/tether|\busdt\b|泰达/i] },
  { id: "circle", name: "Circle", patterns: [/\bcircle\b|\busdc\b/i] },
  { id: "binance", name: "Binance", patterns: [/binance|币安/i] },
  { id: "coinbase", name: "Coinbase", patterns: [/coinbase/i] },
  { id: "okx", name: "OKX", patterns: [/\bokx\b|\bokex\b|欧易/i] },
  { id: "bybit", name: "Bybit", patterns: [/bybit/i] },
  { id: "kraken", name: "Kraken", patterns: [/\bkraken\b/i] },
  { id: "bitfinex", name: "Bitfinex", patterns: [/bitfinex/i] },
  { id: "gemini", name: "Gemini", patterns: [/\bgemini\s+(?:trust|exchange)\b|\bgemini\b/i] },
  { id: "robinhood", name: "Robinhood", patterns: [/robinhood/i] },
  { id: "microstrategy", name: "MicroStrategy", patterns: [/microstrategy|\bMSTR\b|微策略/] },
  { id: "blackrock", name: "BlackRock", patterns: [/blackrock|贝莱德|\biShares\b/i] },
  { id: "fidelity", name: "Fidelity", patterns: [/fidelity|富达/i] },
  { id: "grayscale", name: "Grayscale", patterns: [/grayscale|灰度/i] },
  { id: "sec", name: "SEC", patterns: [/\bSEC\b|securities\s+and\s+exchange\s+commission|美国证券交易委员会/] },
  { id: "cftc", name: "CFTC", patterns: [/\bCFTC\b|commodity\s+futures\s+trading\s+commission/] },
  { id: "fed", name: "美联储", patterns: [/美联储|联储|\bFed\b|\bFOMC\b|federal\s+reserve/] },
  { id: "ecb", name: "欧洲央行", patterns: [/欧洲央行|欧洲中央银行|\bECB\b|european\s+central\s+bank/] },
  { id: "pboc", name: "中国人民银行", patterns: [/中国人民银行|人民银行|中国央行|\bPBOC\b/] },
  { id: "csrc", name: "中国证监会", patterns: [/中国证监会|\bCSRC\b|证监会/] },
  { id: "sfc-hk", name: "香港证监会", patterns: [/香港证监会|\bSFC\b|香港证券及期货事务监察委员会/] },
  { id: "treasury", name: "美国财政部", patterns: [/美国财政部|美财政部|\bU\.?S\.?\s+Treasury\b|\bOFAC\b/] },
  { id: "nvidia", name: "NVIDIA", patterns: [/nvidia|英伟达|\bNVDA\b/i] },
  { id: "apple", name: "Apple", patterns: [/\bapple\b|苹果|\bAAPL\b/i] },
  { id: "microsoft", name: "Microsoft", patterns: [/microsoft|微软|\bMSFT\b/i] },
  { id: "tesla", name: "Tesla", patterns: [/\btesla\b|特斯拉|\bTSLA\b/i] },
  { id: "google", name: "Google", patterns: [/google|谷歌|alphabet|\bGOOGL?\b/i] },
  { id: "meta", name: "Meta", patterns: [/\bmeta\s+platforms\b|\bfacebook\b|脸书|\bMETA\b/] },
  { id: "amazon", name: "Amazon", patterns: [/amazon|亚马逊|\bAMZN\b|amazon\s+web\s+services/i] },
  { id: "tsmc", name: "台积电", patterns: [/台积电|\bTSMC\b|台湾积体电路/] },
  // 媒体信源的 owner_entity_id（industry/sources.json）：只用来认发布方，不进 ENTITIES，也不给标签。
  { id: "panews", name: "PANews", patterns: [/panews|panewslab/i] },
  { id: "chaincatcher", name: "链捕手", patterns: [/chaincatcher|链捕手/i] },
  { id: "coindesk", name: "CoinDesk", patterns: [/coindesk/i] },
  { id: "theblock", name: "The Block", patterns: [/the\s*block\b/i] },
  { id: "cointelegraph", name: "Cointelegraph", patterns: [/cointelegraph/i] },
  { id: "decrypt", name: "Decrypt", patterns: [/\bdecrypt\b/i] },
  { id: "blockworks", name: "Blockworks", patterns: [/blockworks/i] },
  { id: "thedefiant", name: "The Defiant", patterns: [/the\s*defiant/i] },
  { id: "bitcoinmagazine", name: "Bitcoin Magazine", patterns: [/bitcoin\s*magazine/i] },
  { id: "flashbots", name: "Flashbots", patterns: [/flashbots/i] },
  { id: "cnbc", name: "CNBC", patterns: [/\bCNBC\b/] },
  { id: "bloomberg", name: "Bloomberg", patterns: [/bloomberg|彭博/i] },
  { id: "ft", name: "Financial Times", patterns: [/financial\s*times|金融时报|\bFT\.com\b/i] },
  { id: "seekingalpha", name: "Seeking Alpha", patterns: [/seeking\s*alpha/i] },
  { id: "marketwatch", name: "MarketWatch", patterns: [/marketwatch/i] },
  { id: "wallstreetcn", name: "华尔街见闻", patterns: [/华尔街见闻|wallstreetcn/i] },
  { id: "stats-cn", name: "国家统计局", patterns: [/国家统计局|stats\.gov\.cn/i] },
  { id: "jiemian", name: "界面新闻", patterns: [/界面新闻|jiemian/i] },
  { id: "tmtpost", name: "钛媒体", patterns: [/钛媒体|tmtpost/i] },
  { id: "eeo", name: "经济观察报", patterns: [/经济观察报|eeo\.com\.cn/i] },
  { id: "eastmoney", name: "东方财富", patterns: [/东方财富|eastmoney/i] },
  { id: "cryptoslate", name: "CryptoSlate", patterns: [/cryptoslate/i] },
  { id: "protos", name: "Protos", patterns: [/\bprotos\b/i] },
  { id: "unchained", name: "Unchained", patterns: [/unchained\s*crypto|\bunchained\b/i] },
  { id: "cryptobriefing", name: "Crypto Briefing", patterns: [/crypto\s*briefing/i] },
  { id: "bea", name: "美国经济分析局", patterns: [/经济分析局|bureau\s+of\s+economic\s+analysis|\bBEA\b/] },
];

/** 这些域名上的文章，发布方就是对应的公司（托管平台如 GitHub、arXiv 不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "bitcoin", domains: ["bitcoincore.org", "bitcoin.org"] },
  { entityId: "ethereum", domains: ["ethereum.org", "blog.ethereum.org"] },
  { entityId: "solana", domains: ["solana.com"] },
  { entityId: "ripple", domains: ["ripple.com"] },
  { entityId: "cardano", domains: ["cardano.org", "iohk.io"] },
  { entityId: "bnb-chain", domains: ["bnbchain.org"] },
  { entityId: "ton", domains: ["ton.org"] },
  { entityId: "uniswap", domains: ["uniswap.org"] },
  { entityId: "aave", domains: ["aave.com"] },
  { entityId: "lido", domains: ["lido.fi"] },
  { entityId: "makerdao", domains: ["makerdao.com", "sky.money"] },
  { entityId: "chainlink", domains: ["chain.link"] },
  { entityId: "tether", domains: ["tether.to"] },
  { entityId: "circle", domains: ["circle.com"] },
  { entityId: "binance", domains: ["binance.com"] },
  { entityId: "coinbase", domains: ["coinbase.com"] },
  { entityId: "okx", domains: ["okx.com"] },
  { entityId: "bybit", domains: ["bybit.com"] },
  { entityId: "kraken", domains: ["kraken.com"] },
  { entityId: "bitfinex", domains: ["bitfinex.com"] },
  { entityId: "gemini", domains: ["gemini.com"] },
  { entityId: "robinhood", domains: ["robinhood.com"] },
  { entityId: "microstrategy", domains: ["microstrategy.com", "strategy.com"] },
  { entityId: "blackrock", domains: ["blackrock.com"] },
  { entityId: "fidelity", domains: ["fidelity.com"] },
  { entityId: "grayscale", domains: ["grayscale.co", "grayscale.com"] },
  { entityId: "sec", domains: ["sec.gov"] },
  { entityId: "cftc", domains: ["cftc.gov"] },
  { entityId: "fed", domains: ["federalreserve.gov"] },
  { entityId: "ecb", domains: ["ecb.europa.eu"] },
  { entityId: "treasury", domains: ["treasury.gov"] },
  { entityId: "nvidia", domains: ["nvidia.com"] },
  { entityId: "apple", domains: ["apple.com"] },
  { entityId: "microsoft", domains: ["microsoft.com"] },
  { entityId: "tesla", domains: ["tesla.com"] },
  { entityId: "google", domains: ["blog.google", "abc.xyz"] },
  { entityId: "meta", domains: ["about.fb.com", "investor.atmeta.com"] },
  { entityId: "amazon", domains: ["aboutamazon.com"] },
  { entityId: "tsmc", domains: ["tsmc.com"] },
];

/** 原文里的这些写法也算提到了对应公司。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "microstrategy", pattern: /\bStrategy\s+(?:Inc|Incorporated)\b/ },
  { entityId: "binance", pattern: /@binance\b/i },
  { entityId: "sec", pattern: /\bSEC\.gov\b|\bEDGAR\b/ },
  { entityId: "blackrock", pattern: /\bIBIT\b|\bETHA\b/ },
];
