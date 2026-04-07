/* ===== Sales Star PWA - Main Application ===== */

// ===== API CONFIG =====
const API_BASE = 'http://localhost:8080/api';
const CURRENT_USER_ID = 1; // 当前登录用户ID，实际项目可从登录态获取

async function api(path, options = {}) {
  const sep = path.includes('?') ? '&' : '?';
  const url = `${API_BASE}${path}${sep}userId=${CURRENT_USER_ID}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const json = await res.json();
    if (json.code !== 200) throw new Error(json.message);
    return json.data;
  } catch (e) {
    console.warn(`[API] ${path} 失败，降级使用本地数据:`, e.message);
    return null; // 调用方自行处理 null（降级本地数据）
  }
}

// ===== LOCAL DATA STORE (离线降级数据) =====
const store = {
  user: {
    name: '张伟', avatar: '张', role: '金牌销售顾问',
    base: 8000, commission: 3480, bonus: 1000,
    target: 50, done: 38, xp: 320, streak: 7
  },

  products: [
    { id: 1, name: 'iPhone 15 Pro Max', brand: 'Apple', emoji: '📱', price: 9999, cost: 7200, stock: 12, sold: 18, tags: ['旗舰', '5G', '热销'], specs: { 屏幕: '6.7英寸 OLED', 处理器: 'A17 Pro', 内存: '8GB', 存储: '256GB起', 电池: '4422mAh', 摄像头: '4800万三摄' }, desc: '苹果最新旗舰，搭载A17 Pro芯片，钛金属机身，专业级三摄系统，适合追求极致体验的用户。', sellingPoints: ['强大的A17 Pro芯片，性能业界第一', '钛金属机身，轻巧耐用', '专业三摄系统，媲美专业相机', '超长续航，配合MagSafe充电'] },
    { id: 2, name: 'iPhone 15', brand: 'Apple', emoji: '📱', price: 5999, cost: 4200, stock: 25, sold: 22, tags: ['热销', '5G'], specs: { 屏幕: '6.1英寸 OLED', 处理器: 'A16 Bionic', 内存: '6GB', 存储: '128GB起', 电池: '3877mAh', 摄像头: '4800万双摄' }, desc: '苹果标准旗舰，全新Dynamic Island设计，USB-C接口，2亿像素摄像头，性价比之选。', sellingPoints: ['Dynamic Island交互设计', 'USB-C统一接口', '4800万像素主摄', 'iOS 17全新功能'] },
    { id: 3, name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', emoji: '📲', price: 9499, cost: 6800, stock: 8, sold: 12, tags: ['旗舰', '内置手写笔', '5G'], specs: { 屏幕: '6.8英寸 AMOLED', 处理器: 'Snapdragon 8 Gen 3', 内存: '12GB', 存储: '256GB起', 电池: '5000mAh', 摄像头: '2亿像素四摄' }, desc: '三星年度旗舰，内置S Pen手写笔，2亿像素主摄，AI功能强大，专业商务人士首选。', sellingPoints: ['内置S Pen，商务必备', '2亿像素相机，10倍光学变焦', 'Galaxy AI智能功能', '5000mAh大电池'] },
    { id: 4, name: 'Huawei Mate 60 Pro', brand: 'Huawei', emoji: '📳', price: 6999, cost: 4900, stock: 15, sold: 20, tags: ['旗舰', '卫星通话', '热销'], specs: { 屏幕: '6.82英寸 LTPO OLED', 处理器: '麒麟9000S', 内存: '12GB', 存储: '256GB起', 电池: '5000mAh', 摄像头: '5000万三摄' }, desc: '华为旗舰回归，支持卫星通话，麒麟芯片加持，金属后盖，国产高端旗舰代表作。', sellingPoints: ['全球首款支持卫星通话的大众手机', '麒麟9000S强大芯片', '徕卡三摄系统', '超可靠双向卫星消息'] },
    { id: 5, name: 'Xiaomi 14 Pro', brand: 'Xiaomi', emoji: '📱', price: 4999, cost: 3400, stock: 30, sold: 35, tags: ['性价比', '徕卡', '5G'], specs: { 屏幕: '6.73英寸 LTPO OLED', 处理器: 'Snapdragon 8 Gen 3', 内存: '12GB', 存储: '256GB起', 电池: '4880mAh', 摄像头: '5000万徕卡三摄' }, desc: '小米年度旗舰，徕卡光学三摄，骁龙8 Gen3顶级芯片，90W有线快充，极致性价比。', sellingPoints: ['徕卡专业三摄，夜拍无敌', '骁龙8 Gen3，性能怪兽', '90W超级快充', 'LTPO屏幕流畅省电'] },
    { id: 6, name: 'OPPO Find X7 Ultra', brand: 'OPPO', emoji: '📱', price: 5999, cost: 4100, stock: 10, sold: 9, tags: ['旗舰', '哈苏', '充电快'], specs: { 屏幕: '6.82英寸 LTPO AMOLED', 处理器: 'Snapdragon 8 Gen 3', 内存: '16GB', 存储: '256GB起', 电池: '5000mAh', 摄像头: '哈苏一英寸主摄' }, desc: 'OPPO顶级旗舰，搭载哈苏一英寸大底主摄，100W超级闪充，双潜望镜头，影像天花板。', sellingPoints: ['哈苏一英寸大底主摄', '双潜望镜头，10倍光学变焦', '100W超级闪充', '50W无线闪充'] },
    { id: 7, name: 'Xiaomi Redmi Note 13 Pro', brand: 'Xiaomi', emoji: '📱', price: 1999, cost: 1300, stock: 50, sold: 45, tags: ['性价比', '入门旗舰'], specs: { 屏幕: '6.67英寸 OLED', 处理器: 'Snapdragon 7s Gen 2', 内存: '8GB', 存储: '256GB起', 电池: '5100mAh', 摄像头: '2亿像素主摄' }, desc: '2亿像素主摄入门神机，5100mAh超大电池，33W快充，超薄机身，年轻人的第一台好手机。', sellingPoints: ['2亿像素主摄，拍照无敌', '5100mAh超大电池', '33W快充', '超薄轻巧机身'] },
    { id: 8, name: 'Samsung Galaxy A54', brand: 'Samsung', emoji: '📲', price: 2999, cost: 2100, stock: 20, sold: 16, tags: ['中端', '夜拍'], specs: { 屏幕: '6.4英寸 Super AMOLED', 处理器: 'Exynos 1380', 内存: '8GB', 存储: '128GB起', 电池: '5000mAh', 摄像头: '5000万三摄' }, desc: '三星中端旗舰，优秀的夜拍能力，5000mAh大电池，IP67防水，颜值与性能并存。', sellingPoints: ['优秀的夜间拍摄', 'IP67防水设计', '5000mAh大电池', '三星One UI流畅体验'] },
  ],

  orders: [
    { id: 'ORD-2024-001', customer: '李明华', product: 'iPhone 15 Pro Max', productId: 1, qty: 1, amount: 9999, commission: 280, status: 'completed', date: '2024-01-15', note: '客户要求黑色钛金属款' },
    { id: 'ORD-2024-002', customer: '王小丽', product: 'Xiaomi 14 Pro', productId: 5, qty: 2, amount: 9998, commission: 319, status: 'processing', date: '2024-01-18', note: '夫妻二人同款' },
    { id: 'ORD-2024-003', customer: '陈建国', product: 'Huawei Mate 60 Pro', productId: 4, qty: 1, amount: 6999, commission: 210, status: 'pending', date: '2024-01-20', note: '需要卫星通话功能' },
    { id: 'ORD-2024-004', customer: '张美玲', product: 'Samsung Galaxy S24 Ultra', productId: 3, qty: 1, amount: 9499, commission: 265, status: 'pending', date: '2024-01-21', note: '商务使用，需要S Pen' },
    { id: 'ORD-2024-005', customer: '刘强', product: 'Redmi Note 13 Pro', productId: 7, qty: 3, amount: 5997, commission: 213, status: 'completed', date: '2024-01-10', note: '公司采购' },
    { id: 'ORD-2024-006', customer: '赵雪', product: 'OPPO Find X7 Ultra', productId: 6, qty: 1, amount: 5999, commission: 190, status: 'processing', date: '2024-01-19', note: '摄影爱好者，特别看重拍照' },
    { id: 'ORD-2024-007', customer: '孙伟', product: 'iPhone 15', productId: 2, qty: 1, amount: 5999, commission: 180, status: 'pending', date: '2024-01-22', note: '从安卓换苹果，需要数据迁移帮助' },
    { id: 'ORD-2024-008', customer: '周建伟', product: 'Samsung Galaxy A54', productId: 8, qty: 2, amount: 5998, commission: 180, status: 'cancelled', date: '2024-01-12', note: '客户临时取消' },
  ],

  customers: [
    { id: 1, name: '李明华', phone: '138****1234', age: 35, job: '企业高管', budget: '6000+', segment: 'vip', tags: ['高消费', '苹果用户', '回头客'], visits: [{ date: '2024-01-15', type: 'visit', note: '成功推荐iPhone 15 Pro Max，客户非常满意，表示朋友也有购机需求' }, { date: '2024-01-05', type: 'call', note: '回访上次购机体验，客户反馈良好，对钛金属机身非常喜欢' }, { date: '2023-12-20', type: 'visit', note: '到店体验iPhone 15系列，重点介绍Pro Max的摄影功能' }], purchased: ['iPhone 14 Pro', 'iPhone 15 Pro Max'], budget_actual: 9999, tags2: ['回头客', '高净值'] },
    { id: 2, name: '王小丽', phone: '139****5678', age: 28, job: '设计师', budget: '4000-6000', segment: 'hot', tags: ['喜欢小米', '双购'], visits: [{ date: '2024-01-18', type: 'visit', note: '为自己和丈夫各买一台小米14 Pro，对徕卡相机非常感兴趣' }, { date: '2024-01-10', type: 'wechat', note: '发了小米14 Pro的产品介绍，客户表示很感兴趣，约好周末来店' }], purchased: ['Xiaomi 14 Pro x2'], budget_actual: 9998, tags2: ['设计师', '摄影爱好'] },
    { id: 3, name: '陈建国', phone: '136****9012', age: 52, job: '企业主', budget: '6000+', segment: 'hot', tags: ['华为粉丝', '商务需求'], visits: [{ date: '2024-01-20', type: 'visit', note: '意向购买Mate 60 Pro，对卫星通话功能特别感兴趣，经常去偏远地区出差' }, { date: '2024-01-15', type: 'call', note: '电话介绍Mate 60 Pro的卫星通话功能，客户听完非常心动' }], purchased: [], budget_actual: 6999, tags2: ['商务人士', '差旅常客'] },
    { id: 4, name: '张美玲', phone: '135****3456', age: 30, job: '律师', budget: '6000+', segment: 'warm', tags: ['三星用户', 'S Pen'], visits: [{ date: '2024-01-21', type: 'visit', note: '体验了S24 Ultra的S Pen功能，对法庭笔记应用很感兴趣，但价格有些犹豫' }], purchased: ['Samsung Galaxy S21'], budget_actual: 9499, tags2: ['专业人士'] },
    { id: 5, name: '刘强', phone: '137****7890', age: 42, job: '公司采购经理', budget: '1000-2000', segment: 'vip', tags: ['批量采购', '企业客户'], visits: [{ date: '2024-01-10', type: 'visit', note: '公司年底员工福利，批量采购3台Redmi Note 13 Pro' }, { date: '2023-10-15', type: 'visit', note: '上次也是批量采购，8台小米手机，表示年底还会有一批' }], purchased: ['Redmi Note 13 Pro x3', 'Xiaomi 13 x8'], budget_actual: 5997, tags2: ['企业客户', '批量采购'] },
    { id: 6, name: '赵雪', phone: '180****2345', age: 25, job: '自媒体博主', budget: '4000-6000', segment: 'hot', tags: ['摄影', 'OPPO粉'], visits: [{ date: '2024-01-19', type: 'visit', note: '对OPPO Find X7 Ultra的哈苏相机非常感兴趣，做美食博主，拍照要求高' }, { date: '2024-01-12', type: 'wechat', note: '在朋友圈看到我发的Find X7 Ultra测评，主动来询问' }], purchased: [], budget_actual: 5999, tags2: ['内容创作者', '摄影发烧友'] },
    { id: 7, name: '孙伟', phone: '188****6789', age: 22, job: '大学生', budget: '4000-6000', segment: 'warm', tags: ['首次购机', '安卓转苹果'], visits: [{ date: '2024-01-22', type: 'visit', note: '父母赞助的生日礼物，第一次购买苹果，担心数据迁移问题，已承诺帮助操作' }], purchased: [], budget_actual: 5999, tags2: ['年轻用户', '首次购机'] },
    { id: 8, name: '周建伟', phone: '181****0123', age: 38, job: '工程师', budget: '2000-4000', segment: 'cold', tags: ['取消订单', '需跟进'], visits: [{ date: '2024-01-22', type: 'call', note: '联系询问取消原因，说是暂时资金紧张，表示2月份可能会回来购买' }, { date: '2024-01-12', type: 'visit', note: '下单了Galaxy A54 x2，但当天取消了' }], purchased: [], budget_actual: 2999, tags2: ['需重新跟进'] },
    { id: 9, name: '黄芳', phone: '150****4567', age: 45, job: '医生', budget: '4000-6000', segment: 'warm', tags: ['健康关注', '大屏'], visits: [{ date: '2024-01-08', type: 'visit', note: '关注手机健康功能和大屏阅读，Mate 60 Pro很感兴趣，但还在比较中' }], purchased: ['Huawei P30'], budget_actual: 0, tags2: ['老华为用户'] },
  ],

  leaderboard: [
    { name: '赵刚', avatar: '赵', sales: 52, amount: 298000, rank: 1, trend: 'up' },
    { name: '张伟', avatar: '张', sales: 38, amount: 186000, rank: 2, trend: 'neutral', isMe: true },
    { name: '李娜', avatar: '李', sales: 35, amount: 175000, rank: 3, trend: 'up' },
    { name: '王磊', avatar: '王', sales: 30, amount: 142000, rank: 4, trend: 'down' },
    { name: '陈琳', avatar: '陈', sales: 28, amount: 135000, rank: 5, trend: 'up' },
    { name: '刘洋', avatar: '刘', sales: 25, amount: 120000, rank: 6, trend: 'down' },
    { name: '孙婷', avatar: '孙', sales: 22, amount: 98000, rank: 7, trend: 'neutral' },
    { name: '周强', avatar: '周', sales: 18, amount: 86000, rank: 8, trend: 'down' },
  ],

  tasks: [
    { id: 1, text: '回访李明华，询问iPhone 15使用体验', done: true, xp: 10 },
    { id: 2, text: '跟进陈建国，推进Mate 60 Pro订单', done: true, xp: 15 },
    { id: 3, text: '联系孙伟，协助iPhone数据迁移', done: false, xp: 10 },
    { id: 4, text: '完成今日每日一练', done: false, xp: 20 },
  ],

  salesTips: [
    { id: 1, category: 'open', icon: '👋', title: '黄金开场30秒', content: '见到客户前3句话决定成败。先问候，再表明来意，最后留一个开放式问题。例如："您好！我是这里的手机顾问张伟，看您在看手机，请问是自己用还是送人呢？" 避免直接问"要买什么手机"，这会让客户有压力。' },
    { id: 2, category: 'open', icon: '🎯', title: '快速找到购机动机', content: '用SPIN提问找需求：状况问题（现在用什么手机）→ 难点问题（有什么不满意）→ 暗示问题（这些问题对您有什么影响）→ 需求问题（如果有款手机能解决这些问题，您有兴趣了解吗？）。5分钟内完成，精准定位客户需求。' },
    { id: 3, category: 'objection', icon: '💡', title: '"价格太贵了"异议处理', content: '先同理，再转化。\n\n1. "我理解您对价格的关注，这很正常"\n2. "我们来算一笔账：这款手机用3年，每天只需X元，比一杯咖啡还便宜"\n3. "更重要的是，它每天帮您[提升工作效率/拍出美好时刻]，您觉得这个价值值得吗？"\n\n把价格分摊到每天使用成本，降低心理压力。' },
    { id: 4, category: 'objection', icon: '🔄', title: '"我再考虑考虑"的破解', content: '"考虑"背后通常是"不确定"或"想比较"。应对方法：\n\n1. 微笑问："您主要还有什么顾虑呢？"\n2. 找出真实异议后针对性解决\n3. 创造紧迫感："这款颜色只剩2台了"\n4. 提供体验："您先带回家用3天，不满意随时换"\n\n记住：客户离开了就很少回来！' },
    { id: 5, category: 'close', icon: '🤝', title: '二选一成交法', content: '不要问"您买不买"，而是让客户在两个选项中选一个，默认成交。\n\n例如：\n- "您是选128GB还是256GB的呢？"\n- "今天付款您是微信还是银行卡更方便？"\n- "您是要这个曜石黑还是钛金属银的？"\n\n让客户的注意力集中在选哪个，而不是买不买。' },
    { id: 6, category: 'close', icon: '⚡', title: '从众效应成交法', content: '利用社会认同心理促成成交。\n\n"这款iPhone 15 Pro Max是我们这个月卖得最好的型号，很多像您这样的[职业/年龄]都在用，特别是[用户痛点]这一点，大家都说解决了他们的问题。正好现在还有现货，要不我帮您试试效果？"' },
    { id: 7, category: 'followup', icon: '📱', title: '完美售后跟进模板', content: '购机后跟进3步曲：\n\n第1天："[客户名]您好！手机到手了吗？有什么不会操作的地方欢迎问我，我来帮您搞定😊"\n\n第7天："使用一周了，效果怎么样？有没有喜欢上这款手机？"\n\n第30天："[客户名]您好，上次买的手机用着还好吧？有朋友也在看手机吗？我这边最近到了一批新品，有机会介绍给您的朋友哦！"' },
    { id: 8, category: 'followup', icon: '🎁', title: '裂变客户：让老客户带新客户', content: '满意的客户是最好的销售员。跟进要点：\n\n1. 主动问"您身边有没有朋友也在换手机？"\n2. 提供转介绍奖励："您介绍朋友来，朋友买到手机后，我给您申请一个精美保护壳"\n3. 朋友圈互动，时常点赞评论客户的动态，刷存在感\n4. 节假日发节日问候，不要在节假日直接推产品' },
  ],

  quiz: [
    { q: '客户说"太贵了"时，最佳的第一反应是？', opts: ['立刻打折', '解释价格合理性', '先表示理解，再引导价值', '不理睬，继续推销'], correct: 2, explain: '先同理客户感受，再引导客户关注价值而非价格，是处理价格异议的黄金法则。' },
    { q: '以下哪种开场白最容易让客户产生好感？', opts: ['"我们这款手机很好！"', '"您要买什么价位的？"', '"您好，请问是自己用还是送人呢？"', '"今天有活动哦！"'], correct: 2, explain: '开放式问题让客户感到被尊重，同时帮助你了解客户需求，是最佳开场白策略。' },
    { q: '成交时最有效的提问方式是？', opts: ['"你买不买？"', '"这个好不好？"', '"你要128G还是256G？"', '"价格可以吗？"'], correct: 2, explain: '二选一问题（默认客户已经决定购买）把客户注意力从"买不买"转移到"买哪个"，成交率大幅提升。' },
    { q: '客户说"我再想想"时，你应该怎么做？', opts: ['立刻答应等他回来', '请他离开', '微笑追问真实顾虑', '主动联系其他客户'], correct: 2, explain: '"再想想"背后往往有未解决的顾虑，找出真实异议才能针对性解决，客户一旦离开回购率极低。' },
  ],

  learningPath: [
    { icon: '🌟', title: '销售基础入门', sub: '了解手机销售基本流程', xp: 50, done: true },
    { icon: '🎯', title: '需求挖掘技巧', sub: 'SPIN提问法实战', xp: 80, done: true },
    { icon: '📱', title: '产品知识精通', sub: '主流品牌核心卖点', xp: 100, done: false, active: true },
    { icon: '🛡️', title: '异议处理专家', sub: '10大常见异议破解', xp: 120, done: false },
    { icon: '🏆', title: '成交大师', sub: '12种成交技巧', xp: 150, done: false },
    { icon: '👑', title: '客户关系管理', sub: '裂变客户与维系', xp: 200, done: false },
  ],

  motivationQuotes: [
    '"今天的努力，是明天的奖励！"',
    '"每一个成交，都是你成长的勋章！"',
    '"不是因为容易才去做，是因为重要才坚持！"',
    '"销售不是说话的技艺，而是倾听的艺术！"',
    '"拒绝是成交的开始！"',
    '"你见过的每个客户，都是一个改变命运的机会！"',
  ],
};

// ===== STATE =====
let state = {
  currentPage: 'dashboard',
  filteredProducts: [...store.products],
  filteredOrders: [...store.orders],
  filteredCustomers: [...store.customers],
  productFilter: 'all',
  orderFilter: 'all',
  customerFilter: 'all',
  tipFilter: 'all',
  selectedCustomerId: null,
  quizAnswered: false,
  quizSelected: null,
  charts: {},
};

// ===== NAVIGATION =====
function navigate(page) {
  const pages = ['dashboard', 'products', 'orders', 'customers', 'money', 'rank', 'training'];
  if (!pages.includes(page)) return;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');

  const navMap = { dashboard: 0, products: 1, orders: 2, customers: 3, money: 4, rank: 4, training: 5 };
  const navItems = document.querySelectorAll('.nav-item');
  if (navMap[page] !== undefined) navItems[navMap[page]]?.classList.add('active');

  state.currentPage = page;
  onPageEnter(page);
}

function onPageEnter(page) {
  if (page === 'dashboard') renderDashboard();
  if (page === 'products') renderProducts();
  if (page === 'orders') renderOrders();
  if (page === 'customers') renderCustomers();
  if (page === 'money') renderMoney();
  if (page === 'rank') renderRank();
  if (page === 'training') renderTraining();
}

// ===== DASHBOARD =====
async function renderDashboard() {
  const quote = store.motivationQuotes[Math.floor(Math.random() * store.motivationQuotes.length)];
  document.getElementById('motivationText').querySelector('.motivation-quote').textContent = quote;

  const data = await api('/dashboard');
  if (data) {
    // 用户信息
    const u = data.user;
    document.getElementById('headerName').textContent = u.name;
    document.getElementById('headerAvatar').textContent = u.avatar;
    if (u.rank) document.getElementById('dashRank').textContent = '#' + u.rank;

    // 收益
    const e = data.earnings;
    document.getElementById('dashEarnings').textContent = '¥' + fmtMoney(e.total);

    // 目标
    const g = data.goal;
    document.getElementById('daysLeft').textContent = g.daysLeft;
    document.getElementById('goalPct').textContent = g.pct + '%';
    document.getElementById('goalBar').style.width = g.pct + '%';
    document.getElementById('goalDone').textContent = g.done + '台';
    document.getElementById('goalTarget').textContent = g.target + '台';

    // 今日任务
    if (data.tasks) renderTodayTasksFromData(data.tasks);

    // 爆款商品
    if (data.hotProducts) renderHotProductsFromData(data.hotProducts);

    // 趋势图
    if (data.trendData) renderTrendChartFromData(data.trendData);

    // 更新订单数
    document.getElementById('dashOrders').textContent = store.orders.filter(o => o.status !== 'cancelled').length;
    document.getElementById('dashCustomers').textContent = store.customers.length;
  } else {
    // 降级：使用本地数据
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    document.getElementById('daysLeft').textContent = daysInMonth - now.getDate();
    const earnings = store.user.base + store.user.commission + store.user.bonus;
    document.getElementById('dashEarnings').textContent = '¥' + earnings.toLocaleString();
    const pct = Math.round(store.user.done / store.user.target * 100);
    document.getElementById('goalPct').textContent = pct + '%';
    document.getElementById('goalBar').style.width = pct + '%';
    document.getElementById('goalDone').textContent = store.user.done + '台';
    document.getElementById('goalTarget').textContent = store.user.target + '台';
    renderTodayTasks();
    renderHotProducts();
    renderTrendChart();
  }
}

function fmtMoney(fen) {
  // 后端金额单位为"分"，前端显示转为"元"
  return (fen / 100).toLocaleString();
}

function renderTodayTasksFromData(tasks) {
  const el = document.getElementById('todayTasks');
  const done = tasks.filter(t => t.done).length;
  document.getElementById('taskDone').textContent = done + '/' + tasks.length;
  el.innerHTML = tasks.map(t => `
    <div class="task-item ${t.done ? 'done' : ''}" onclick="toggleTask(${t.id})">
      <div class="task-check">${t.done ? '✓' : ''}</div>
      <span class="task-text">${t.content}</span>
      <span class="task-xp">+${t.xp}XP</span>
    </div>`).join('');
}

function renderTodayTasks() {
  renderTodayTasksFromData(store.tasks.map(t => ({ ...t, content: t.text })));
}

async function toggleTask(id) {
  const data = await api(`/tasks/${id}/toggle`, { method: 'PUT' });
  if (data) {
    showToast(data.done ? '✅ 任务完成！+' + data.xp + ' XP' : '↩ 任务已撤销');
    renderDashboard();
  } else {
    const task = store.tasks.find(t => t.id === id);
    if (task) {
      task.done = !task.done;
      if (task.done) { store.user.xp += task.xp; showToast('✅ 任务完成！+' + task.xp + ' XP'); }
      renderTodayTasks();
    }
  }
}

function renderHotProductsFromData(products) {
  document.getElementById('hotProducts').innerHTML = products.map(p => `
    <div class="hot-product-card" onclick="showProductDetail(${p.id})">
      <div class="hot-product-emoji">${p.emoji}</div>
      <div class="hot-product-name">${p.name}</div>
      <div class="hot-product-profit">+¥${fmtMoney(p.profit)}</div>
      <div class="hot-product-tag">利润/台</div>
    </div>`).join('');
}

function renderHotProducts() {
  const sorted = [...store.products].sort((a, b) => (b.price - b.cost) - (a.price - a.cost)).slice(0, 5);
  renderHotProductsFromData(sorted.map(p => ({ ...p, profit: (p.price - p.cost) * 100 })));
}

function renderTrendChartFromData(trendData) {
  const ctx = document.getElementById('trendChart');
  if (!ctx) return;
  if (state.charts.trend) { state.charts.trend.destroy(); }
  const labels = ['6天前', '5天前', '4天前', '3天前', '昨天', '今天'];
  // trendData 可能7个或6个元素
  const data = trendData.slice(-6);
  state.charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{ data, borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#6366f1', pointRadius: 4, borderWidth: 2 }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9ca3af', font: { size: 11 } } }, y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9ca3af', font: { size: 11 } }, beginAtZero: true } } }
  });
}

function renderTrendChart() {
  const ctx = document.getElementById('trendChart');
  if (!ctx) return;
  if (state.charts.trend) { state.charts.trend.destroy(); }
  const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const data = [4, 6, 3, 8, 5, 9, 7];
  state.charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#6c63ff',
        backgroundColor: 'rgba(108,99,255,0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#a78bfa',
        pointRadius: 4,
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b68a0', font: { size: 11 } } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b68a0', font: { size: 11 } }, beginAtZero: true }
      }
    }
  });
}

// ===== PRODUCTS =====
async function renderProducts() { await applyProductFilters(); }

async function applyProductFilters() {
  const keyword = document.getElementById('productSearch')?.value.trim() || '';
  const brand = state.productFilter;
  const sort = document.getElementById('productSort')?.value || 'profit_desc';

  let params = `sort=${sort}`;
  if (brand && brand !== 'all') params += `&brand=${encodeURIComponent(brand)}`;
  if (keyword) params += `&keyword=${encodeURIComponent(keyword)}`;

  let list = await api(`/products?${params}`);
  if (!list) {
    // 降级：本地筛选
    list = store.products
      .filter(p => (brand === 'all' || p.brand === brand) && (!keyword || p.name.toLowerCase().includes(keyword.toLowerCase())))
      .map(p => ({ ...p, profit: (p.price - p.cost) * 100, profitMargin: Math.round((p.price - p.cost) / p.price * 100), price: p.price * 100, cost: p.cost * 100 }));
  }

  document.getElementById('productGrid').innerHTML = list.map(p => `
    <div class="product-item" onclick="showProductDetail(${p.id})">
      <div class="product-emoji">${p.emoji || '📱'}</div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-brand">${p.brand}</div>
        <div class="product-price-row">
          <span class="product-price">¥${fmtMoney(p.price)}</span>
          <span class="product-cost">¥${fmtMoney(p.cost)}</span>
          <span class="product-profit-badge">+¥${fmtMoney(p.profit)} · ${p.profitMargin}%</span>
        </div>
        <div class="product-tags">
          ${(p.tags || []).map(t => `<span class="product-tag">${t}</span>`).join('')}
        </div>
        <div class="product-stock ${p.stock < 15 ? 'low' : 'ok'}">
          ${p.stock < 15 ? '⚠️' : '✅'} 库存 ${p.stock} 台
        </div>
      </div>
    </div>`).join('');
}

async function filterProducts() { await applyProductFilters(); }
async function sortProducts() { await applyProductFilters(); }

function filterByBrand(brand, btn) {
  state.productFilter = brand;
  document.querySelectorAll('#productFilters .filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyProductFilters();
}

async function showProductDetail(id) {
  let p = await api(`/products/${id}`);
  if (!p) p = store.products.find(x => x.id === id);
  if (!p) return;
  // 统一字段（API返回分，本地是元）
  const price = p.price > 10000 ? fmtMoney(p.price) : p.price.toLocaleString();
  const profit = p.profit ? fmtMoney(p.profit) : (p.price - p.cost).toLocaleString();
  const margin = p.profitMargin || Math.round((p.price - p.cost) / p.price * 100);
  const specs = typeof p.specs === 'string' ? JSON.parse(p.specs || '{}') : (p.specs || {});
  const sps = typeof p.sellingPoints === 'string' ? JSON.parse(p.sellingPoints || '[]') : (p.sellingPoints || []);
  const stock = p.stock;
  const sold = p.sold;
  const cost = p.cost > 10000 ? fmtMoney(p.cost) : p.cost.toLocaleString();
  // 以下原逻辑保留但用新变量
  const _profit = profit;
  const _margin = margin;
  document.getElementById('productModalContent').innerHTML = `
    <div class="pm-emoji">${p.emoji || '📱'}</div>
    <div class="pm-name">${p.name}</div>
    <div class="pm-brand">${p.brand}</div>
    <div class="pm-price-row">
      <div>
        <div style="font-size:11px;color:var(--text2);margin-bottom:4px">零售价</div>
        <div class="pm-price">¥${price}</div>
      </div>
      <div class="pm-profit-box">
        <div class="pm-profit-val">¥${_profit}</div>
        <div class="pm-profit-lbl">利润 ${_margin}%</div>
      </div>
    </div>
    <div class="pm-stats-grid">
      <div class="pm-stat-item">
        <div class="pm-stat-val" style="color:var(--text2)">¥${cost}</div>
        <div class="pm-stat-lbl">进价</div>
      </div>
      <div class="pm-stat-item">
        <div class="pm-stat-val" style="color:var(--blue)">${stock}台</div>
        <div class="pm-stat-lbl">库存</div>
      </div>
      <div class="pm-stat-item">
        <div class="pm-stat-val" style="color:var(--gold)">${sold}台</div>
        <div class="pm-stat-lbl">已售</div>
      </div>
    </div>
    <div class="pm-desc">${p.description || p.desc || ''}</div>
    <div class="pm-specs">
      <h4>📋 规格参数</h4>
      ${Object.entries(specs).map(([k, v]) => `
        <div class="pm-spec-row">
          <span class="pm-spec-key">${k}</span>
          <span class="pm-spec-val">${v}</span>
        </div>`).join('')}
    </div>
    <div class="pm-selling-points">
      <h4>💬 销售话术要点</h4>
      ${sps.map(sp => `
        <div class="pm-sp-item"><span>✦</span><span>${sp}</span></div>`).join('')}
    </div>
    <button class="btn-primary full-width" style="margin-top:12px" onclick="showAddOrderFromProduct(${p.id})">
      📦 创建订单
    </button>
  `;
  openModal('productModal');
}

function closeProductModal() { closeModal('productModal'); }

function showAddOrderFromProduct(productId) {
  closeProductModal();
  setTimeout(() => {
    showAddOrder();
    const sel = document.getElementById('newOrderProduct');
    if (sel) sel.value = productId;
  }, 300);
}

// ===== ORDERS =====
async function renderOrders() {
  const stats = await api('/orders/stats');
  if (stats) {
    document.getElementById('orderStats').innerHTML = [
      { label: '全部',   val: Object.values(stats).reduce((a,b) => a+b, 0), color: 'var(--text)' },
      { label: '待处理', val: stats.pending    || 0, color: 'var(--gold)'  },
      { label: '进行中', val: stats.processing || 0, color: 'var(--blue)'  },
      { label: '已完成', val: stats.completed  || 0, color: 'var(--green)' },
      { label: '已取消', val: stats.cancelled  || 0, color: 'var(--red)'   },
    ].map(s => `
      <div class="order-stat-mini">
        <div class="osm-val" style="color:${s.color}">${s.val}</div>
        <div class="osm-lbl">${s.label}</div>
      </div>`).join('');
    document.getElementById('pendingBadge').textContent = stats.pending || 0;
  }
  await applyOrderFilter();
}

async function applyOrderFilter() {
  const filter = state.orderFilter;
  let list = await api(`/orders${filter && filter !== 'all' ? '?status=' + filter : ''}`);
  if (!list) list = filter === 'all' ? store.orders : store.orders.filter(o => o.status === filter);

  const statusMap   = { pending: '待处理', processing: '进行中', completed: '已完成', cancelled: '已取消' };
  const statusClass = { pending: 'status-pending', processing: 'status-processing', completed: 'status-completed', cancelled: 'status-cancelled' };

  document.getElementById('orderList').innerHTML = list.map(o => {
    const amt  = o.amount  > 100000 ? fmtMoney(o.amount)  : o.amount.toLocaleString();
    const comm = o.commission > 10000 ? fmtMoney(o.commission) : o.commission;
    const qty  = o.quantity || o.qty || 1;
    const prod = o.productName || o.product || '';
    const cust = o.customerName || o.customer || '';
    const date = o.orderDate || o.date || '';
    const oid  = o.orderNo  || o.id || '';
    return `
    <div class="order-card">
      <div class="order-header">
        <span class="order-id">${oid}</span>
        <span class="order-status ${statusClass[o.status]}">${statusMap[o.status]}</span>
      </div>
      <div class="order-product">📱 ${prod} × ${qty}</div>
      <div class="order-customer-row">👤 ${cust} ${o.note ? '· ' + o.note : ''}</div>
      <div class="order-footer">
        <div>
          <div class="order-amount">¥${amt}</div>
          <div class="order-commission">提成 ¥${comm}</div>
        </div>
        <div>
          <div class="order-date">${date}</div>
          ${o.status === 'pending'    ? `<button class="filter-tab" style="margin-top:4px;padding:4px 10px;font-size:11px" onclick="updateOrderStatus(${o.id},'processing')">开始处理</button>` : ''}
          ${o.status === 'processing' ? `<button class="filter-tab active" style="margin-top:4px;padding:4px 10px;font-size:11px" onclick="updateOrderStatus(${o.id},'completed')">标记完成</button>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');
}

function filterOrders(filter, btn) {
  state.orderFilter = filter;
  document.querySelectorAll('#page-orders .filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyOrderFilter();
}

async function updateOrderStatus(id, status) {
  const data = await api(`/orders/${id}/status`, {
    method: 'PUT', body: JSON.stringify({ status })
  });
  const msgs = { processing: '订单已开始处理！', completed: '🎉 订单完成！收入已记录' };
  showToast(msgs[status] || '状态已更新');
  if (!data) {
    const order = store.orders.find(o => o.id === id);
    if (order) { order.status = status; }
  }
  renderOrders();
}

function showAddOrder() {
  const sel = document.getElementById('newOrderProduct');
  sel.innerHTML = store.products.map(p => `<option value="${p.id}">${p.name} - ¥${p.price.toLocaleString()}</option>`).join('');
  openModal('addOrderModal');
}
function closeAddOrder() { closeModal('addOrderModal'); }

function submitOrder() {
  const customer = document.getElementById('newOrderCustomer').value.trim();
  const productId = parseInt(document.getElementById('newOrderProduct').value);
  const qty = parseInt(document.getElementById('newOrderQty').value) || 1;
  const note = document.getElementById('newOrderNote').value.trim();

  if (!customer) { showToast('请输入客户姓名'); return; }
  const product = store.products.find(p => p.id === productId);
  const newOrder = {
    id: 'ORD-2024-' + String(store.orders.length + 1).padStart(3, '0'),
    customer, product: product.name, productId, qty,
    amount: product.price * qty,
    commission: Math.round((product.price - product.cost) * qty * 0.15),
    status: 'pending', date: new Date().toISOString().split('T')[0], note
  };
  store.orders.unshift(newOrder);
  document.getElementById('newOrderCustomer').value = '';
  document.getElementById('newOrderNote').value = '';
  closeAddOrder();
  showToast('✅ 订单已创建！');
  document.getElementById('pendingBadge').textContent = store.orders.filter(o => o.status === 'pending').length;
}

// ===== CUSTOMERS =====
async function renderCustomers() { await applyCustomerFilter(); }

async function applyCustomerFilter() {
  const keyword = document.getElementById('customerSearch')?.value.trim() || '';
  const segment = state.customerFilter;
  let params = '';
  if (segment && segment !== 'all') params += `&segment=${segment}`;
  if (keyword) params += `&keyword=${encodeURIComponent(keyword)}`;

  let list = await api(`/customers?${params}`);
  if (!list) {
    list = store.customers.filter(c => {
      const matchSeg = segment === 'all' || c.segment === segment;
      const matchSearch = !keyword || c.name.includes(keyword) || c.phone.includes(keyword);
      return matchSeg && matchSearch;
    });
  }

  const segLabels = { hot: '🔥 热客', warm: '☀️ 温客', cold: '❄️ 冷客', vip: '👑 VIP' };
  const segBadge = { hot: 'badge-hot', warm: 'badge-warm', cold: 'badge-cold', vip: 'badge-vip' };
  const segAvatarClass = { hot: 'seg-hot', warm: 'seg-warm', cold: 'seg-cold', vip: 'seg-vip' };

  document.getElementById('customerList').innerHTML = list.map(c => {
    const lastVisit = c.visits.length ? c.visits[0].date : '暂无记录';
    return `
    <div class="customer-card" onclick="showCustomerDetail(${c.id})">
      <div class="customer-avatar ${segAvatarClass[c.segment]}">${c.name[0]}</div>
      <div class="customer-info">
        <div class="customer-name">${c.name}</div>
        <div class="customer-meta">${c.phone} · ${c.age}岁 · ${c.job}</div>
        <div class="customer-tags">
          <span class="customer-segment-badge ${segBadge[c.segment]}">${segLabels[c.segment]}</span>
          ${c.tags.map(t => `<span class="product-tag">${t}</span>`).join('')}
        </div>
        <div class="customer-last-visit">最近拜访：${lastVisit}</div>
      </div>
    </div>`;
  }).join('');
}

async function filterCustomers() { await applyCustomerFilter(); }

function filterBySegment(segment, btn) {
  state.customerFilter = segment;
  document.querySelectorAll('#page-customers .filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyCustomerFilter();
}

async function showCustomerDetail(id) {
  let c = await api(`/customers/${id}`);
  if (!c) c = store.customers.find(x => x.id === id);
  if (!c) return;
  state.selectedCustomerId = id;
  const segAvatarClass = { hot: 'seg-hot', warm: 'seg-warm', cold: 'seg-cold', vip: 'seg-vip' };
  const vtypeClass = { call: 'vtype-call', visit: 'vtype-visit', wechat: 'vtype-wechat' };
  const vtypeLabel = { call: '📞 电话', visit: '🚶 到访', wechat: '💬 微信' };

  document.getElementById('customerModalContent').innerHTML = `
    <div class="cust-modal-header">
      <div class="cust-modal-avatar ${segAvatarClass[c.segment]}">${c.name[0]}</div>
      <div>
        <div class="cust-modal-name">${c.name}</div>
        <div class="cust-modal-meta">${c.phone} · ${c.age}岁 · ${c.job}</div>
        <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">
          ${c.tags.map(t => `<span class="product-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>

    <div style="font-size:14px;font-weight:700;margin-bottom:10px">👤 客户画像</div>
    <div class="persona-grid">
      <div class="persona-item">
        <div class="persona-label">预算范围</div>
        <div class="persona-value">¥${c.budget}</div>
      </div>
      <div class="persona-item">
        <div class="persona-label">客户类型</div>
        <div class="persona-value">${{ hot:'🔥 热客', warm:'☀️ 温客', cold:'❄️ 冷客', vip:'👑 VIP' }[c.segment]}</div>
      </div>
      <div class="persona-item">
        <div class="persona-label">拜访次数</div>
        <div class="persona-value">${c.visits.length} 次</div>
      </div>
      <div class="persona-item">
        <div class="persona-label">成交金额</div>
        <div class="persona-value" style="color:var(--gold)">¥${c.budget_actual.toLocaleString()}</div>
      </div>
    </div>

    ${c.purchased.length ? `
    <div style="margin-bottom:14px">
      <div style="font-size:12px;color:var(--text2);margin-bottom:6px">历史购买</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${c.purchased.map(p => `<span class="product-tag" style="color:var(--gold)">${p}</span>`).join('')}
      </div>
    </div>` : ''}

    <div class="visit-record-header">
      <div class="visit-record-title">📋 拜访记录</div>
      <button class="add-visit-btn" onclick="showAddVisit(${c.id})">+ 记录</button>
    </div>
    <div class="visit-timeline">
      ${c.visits.length ? c.visits.map(v => `
        <div class="visit-item">
          <div class="visit-dot"></div>
          <div>
            <div class="visit-date">${v.date}</div>
            <span class="visit-type ${vtypeClass[v.type]}">${vtypeLabel[v.type]}</span>
            <div class="visit-note">${v.note}</div>
          </div>
        </div>`).join('') : '<div style="color:var(--text3);font-size:13px">暂无拜访记录，快去开拓吧！</div>'}
    </div>
  `;
  openModal('customerModal');
}

function closeCustomerModal() { closeModal('customerModal'); }

function showAddVisit(customerId) {
  state.selectedCustomerId = customerId;
  const c = store.customers.find(x => x.id === customerId);
  document.getElementById('visitModalContent').innerHTML = `
    <h3 class="modal-title">添加拜访记录 - ${c.name}</h3>
    <div class="form-group">
      <label>拜访方式</label>
      <select id="visitType" class="form-input">
        <option value="visit">🚶 到访</option>
        <option value="call">📞 电话</option>
        <option value="wechat">💬 微信</option>
      </select>
    </div>
    <div class="form-group">
      <label>拜访内容</label>
      <textarea id="visitNote" placeholder="记录本次拜访的重点内容..." class="form-input" rows="4"></textarea>
    </div>
    <button class="btn-primary full-width" onclick="submitVisit()">保存记录</button>
  `;
  openModal('visitModal');
}

function closeVisitModal() { closeModal('visitModal'); }

async function submitVisit() {
  const type = document.getElementById('visitType').value;
  const note = document.getElementById('visitNote').value.trim();
  if (!note) { showToast('请填写拜访内容'); return; }

  const data = await api(`/customers/${state.selectedCustomerId}/visits`, {
    method: 'POST', body: JSON.stringify({ type, note })
  });
  closeVisitModal();
  showToast('✅ 拜访记录已保存！+10 XP');
  if (!data) {
    const c = store.customers.find(x => x.id === state.selectedCustomerId);
    if (c) c.visits.unshift({ date: new Date().toISOString().split('T')[0], type, note });
    store.user.xp += 10;
  }
  setTimeout(() => showCustomerDetail(state.selectedCustomerId), 350);
}

function showAddCustomer() { openModal('addCustomerModal'); }
function closeAddCustomer() { closeModal('addCustomerModal'); }

async function submitCustomer() {
  const name    = document.getElementById('newCustName').value.trim();
  const phone   = document.getElementById('newCustPhone').value.trim();
  const age     = parseInt(document.getElementById('newCustAge').value) || 0;
  const job     = document.getElementById('newCustJob').value.trim();
  const budget  = document.getElementById('newCustBudget').value;
  const segment = document.getElementById('newCustSegment').value;
  if (!name || !phone) { showToast('请填写姓名和手机号'); return; }

  const data = await api('/customers', {
    method: 'POST', body: JSON.stringify({ name, phone, age, job, budget, segment })
  });
  if (data) {
    store.customers.unshift(data);
  } else {
    store.customers.unshift({ id: Date.now(), name, phone, age, job, budget, segment, tags: [], visits: [], purchased: [], budgetActual: 0 });
  }
  closeAddCustomer();
  showToast('✅ 客户已添加！');
  renderCustomers();
}

// ===== MONEY =====
async function renderMoney() {
  const data = await api('/earnings');
  if (data) {
    document.getElementById('earningsBig').textContent        = '¥' + fmtMoney(data.total);
    document.getElementById('earningsProjected').textContent  = '¥' + fmtMoney(data.projected);
    document.getElementById('epBase').textContent             = '¥' + fmtMoney(data.base);
    document.getElementById('epComm').textContent             = '¥' + fmtMoney(data.commission);
    document.getElementById('epBonus').textContent            = '¥' + fmtMoney(data.bonus);
    renderMilestonesFromData(data.milestones);
    renderIncomeChartFromData(data.base, data.commission, data.bonus);
    renderHistoryChartFromData(data.history);
  } else {
    const earnings = store.user.base + store.user.commission + store.user.bonus;
    const projected = Math.round(earnings * (30 / new Date().getDate()) * 0.9);
    document.getElementById('earningsBig').textContent        = '¥' + earnings.toLocaleString();
    document.getElementById('earningsProjected').textContent  = '¥' + projected.toLocaleString();
    document.getElementById('epBase').textContent             = '¥' + store.user.base.toLocaleString();
    document.getElementById('epComm').textContent             = '¥' + store.user.commission.toLocaleString();
    document.getElementById('epBonus').textContent            = '¥' + store.user.bonus.toLocaleString();
    renderMilestones();
    renderIncomeChart();
    renderHistoryChart();
  }
}

function renderMilestonesFromData(milestones) {
  document.getElementById('milestones').innerHTML = milestones.map(m => {
    const pct = Math.min(100, Math.round(m.current / m.target * 100));
    const achieved = m.current >= m.target;
    const cls = achieved ? 'achieved' : (pct === 0 ? 'locked' : '');
    return `
    <div class="milestone-item ${cls}">
      <div class="milestone-icon">${m.icon}</div>
      <div class="milestone-info">
        <div class="milestone-name">${m.name} ${achieved ? '✅' : ''}</div>
        <div class="milestone-desc">${m.desc}</div>
        <div class="milestone-progress-mini">
          <div class="milestone-progress-fill" style="width:${pct}%"></div>
        </div>
      </div>
      <div class="milestone-reward">${m.reward}</div>
    </div>`;
  }).join('');
}

function renderMilestones() {
  const milestones = [
    { icon: '🥉', name: '初级销售', desc: '完成10台手机销售', target: 10, current: store.user.done, reward: '¥500奖金' },
    { icon: '🥈', name: '中级达人', desc: '完成25台手机销售', target: 25, current: store.user.done, reward: '¥1,500奖金' },
    { icon: '🥇', name: '高级精英', desc: '完成40台手机销售', target: 40, current: store.user.done, reward: '¥3,000奖金' },
    { icon: '👑', name: '销售之王', desc: '完成50台手机销售', target: 50, current: store.user.done, reward: '¥5,000奖金 + 度假奖励' },
    { icon: '💎', name: '传奇销售', desc: '完成80台手机销售', target: 80, current: store.user.done, reward: '¥10,000奖金 + 晋升' },
  ];
  document.getElementById('milestones').innerHTML = milestones.map(m => {
    const pct = Math.min(100, Math.round(m.current / m.target * 100));
    const achieved = m.current >= m.target;
    const cls = achieved ? 'achieved' : (pct === 0 ? 'locked' : '');
    return `
    <div class="milestone-item ${cls}">
      <div class="milestone-icon">${m.icon}</div>
      <div class="milestone-info">
        <div class="milestone-name">${m.name} ${achieved ? '✅' : ''}</div>
        <div class="milestone-desc">${m.desc}</div>
        <div class="milestone-progress-mini">
          <div class="milestone-progress-fill" style="width:${pct}%"></div>
        </div>
      </div>
      <div class="milestone-reward">${m.reward}</div>
    </div>`;
  }).join('');
}

function renderIncomeChartFromData(base, commission, bonus) {
  const ctx = document.getElementById('incomeChart');
  if (!ctx) return;
  if (state.charts.income) state.charts.income.destroy();
  state.charts.income = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['底薪', '销售提成', '奖金'],
      datasets: [{ data: [base, commission, bonus], backgroundColor: ['#4f46e5', '#10b981', '#d97706'], borderWidth: 0, hoverOffset: 6 }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#6b7280', font: { size: 12 }, padding: 16 } } } }
  });
}

function renderIncomeChart() {
  const ctx = document.getElementById('incomeChart');
  if (!ctx) return;
  if (state.charts.income) state.charts.income.destroy();
  state.charts.income = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['底薪', '销售提成', '奖金'],
      datasets: [{
        data: [store.user.base, store.user.commission, store.user.bonus],
        backgroundColor: ['#6c63ff', '#10b981', '#fbbf24'],
        borderWidth: 0,
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#a09dcc', font: { size: 12 }, padding: 16 }
        }
      }
    }
  });
}

function renderHistoryChartFromData(history) {
  const ctx = document.getElementById('historyChart');
  if (!ctx) return;
  if (state.charts.history) state.charts.history.destroy();
  const labels = history.map(h => h.month);
  const data   = history.map(h => h.amount / 100);
  state.charts.history = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: '月收入', data, backgroundColor: 'rgba(79,70,229,0.7)', borderRadius: 6, borderSkipped: false }] },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9ca3af', font: { size: 11 } } }, y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9ca3af', font: { size: 11 }, callback: v => '¥' + (v / 1000).toFixed(0) + 'k' } } } }
  });
}

function renderHistoryChart() {
  const ctx = document.getElementById('historyChart');
  if (!ctx) return;
  if (state.charts.history) state.charts.history.destroy();
  state.charts.history = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['8月', '9月', '10月', '11月', '12月', '1月'],
      datasets: [{
        label: '月收入',
        data: [9200, 10800, 11500, 9800, 13200, 12480],
        backgroundColor: 'rgba(108,99,255,0.6)',
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b68a0', font: { size: 11 } } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b68a0', font: { size: 11 }, callback: v => '¥' + (v / 1000).toFixed(0) + 'k' } }
      }
    }
  });
}

// ===== RANK =====
async function renderRank() {
  const lb = await api('/leaderboard') || store.leaderboard;
  const top3 = lb.slice(0, 3);
  const crowns = ['👑', '🥈', '🥉'];
  const order = [1, 0, 2]; // podium order: 2nd, 1st, 3rd

  document.getElementById('rankPodium').innerHTML = order.map(i => {
    const p = top3[i];
    return `
    <div class="podium-item podium-${i + 1}">
      <div class="podium-crown">${crowns[i]}</div>
      <div class="podium-avatar">${p.avatar}</div>
      <div class="podium-name">${p.name}${p.isMe ? ' (我)' : ''}</div>
      <div class="podium-score">${p.sales}台 · ¥${(p.amount / 10000).toFixed(1)}万</div>
      <div class="podium-block">${i + 1}</div>
    </div>`;
  }).join('');

  const rest = lb.slice(3);
  document.getElementById('rankList').innerHTML = rest.map(p => `
    <div class="rank-item ${p.isMe ? 'is-me' : ''}">
      <div class="rank-num">${p.rank}</div>
      <div class="rank-avatar">${p.avatar}</div>
      <div class="rank-info">
        <div class="rank-name">${p.name}${p.isMe ? ' 👈 我' : ''}</div>
        <div class="rank-sales">${p.sales}台成交</div>
      </div>
      <div class="rank-amount">
        ¥${(p.amount / 10000).toFixed(1)}万
        <span class="rank-trend ${p.trend}">${p.trend === 'up' ? '↑' : p.trend === 'down' ? '↓' : '→'}</span>
      </div>
    </div>`).join('');

  const me = lb.find(p => p.isMe);
  if (me) {
    const prev = store.leaderboard[me.rank - 2];
    const gap = prev ? prev.amount - me.amount : 0;
    document.getElementById('myRankCard').innerHTML = `
      <div class="card-header">
        <span class="card-title">📊 我的数据</span>
      </div>
      <div style="display:flex;gap:16px;text-align:center">
        <div style="flex:1"><div style="font-size:24px;font-weight:800;color:var(--gold)">第${me.rank}名</div><div style="font-size:11px;color:var(--text2)">当前排名</div></div>
        <div style="flex:1"><div style="font-size:20px;font-weight:700">${me.sales}台</div><div style="font-size:11px;color:var(--text2)">销量</div></div>
        <div style="flex:1"><div style="font-size:16px;font-weight:700;color:var(--green)">¥${(me.amount / 10000).toFixed(1)}万</div><div style="font-size:11px;color:var(--text2)">销售额</div></div>
      </div>
      ${gap > 0 ? `<div style="margin-top:12px;padding:10px;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:10px;font-size:12px;color:var(--text2)">
        💡 距第${me.rank - 1}名还差 <span style="color:var(--gold);font-weight:700">¥${gap.toLocaleString()}</span>，冲鸭！🚀
      </div>` : ''}
    `;
  }
}

// ===== TRAINING =====
async function renderTraining() {
  document.getElementById('userXP').textContent = store.user.xp;

  // 每日提示
  const dailyTip = await api('/training/daily-tip');
  const tips = [
    '第一印象决定70%的成交概率。进门前深呼吸，面带微笑，保持自信！',
    '倾听客户说话时，用眼睛看着客户，适时点头，让客户感受到被重视。',
    '永远不要贬低竞品，而是突出自己产品的独特优势。',
    '成交后立即做转介绍铺垫："您满意的话，欢迎介绍朋友来！"',
    '每天记录3个成功案例，找出规律，复制成功！',
  ];
  const todayTip = dailyTip || tips[new Date().getDay() % tips.length];
  document.getElementById('dailyTip').innerHTML = `
    <div class="tip-label">💡 今日销售小贴士</div>
    <div class="tip-content">${todayTip}</div>
  `;

  const done = store.learningPath.filter(l => l.done).length;
  const pct = Math.round(done / store.learningPath.length * 100);
  document.getElementById('learningProgress').textContent = '进度 ' + pct + '%';

  document.getElementById('learningPath').innerHTML = store.learningPath.map(l => `
    <div class="lp-item ${l.done ? 'done' : ''} ${l.active ? 'active-step' : ''}">
      <div class="lp-icon">${l.icon}</div>
      <div class="lp-info">
        <div class="lp-title">${l.title}</div>
        <div class="lp-sub">${l.sub}</div>
      </div>
      <div class="lp-xp">+${l.xp}XP</div>
      <div class="lp-status">${l.done ? '✅' : l.active ? '▶️' : '🔒'}</div>
    </div>`).join('');

  renderTipsList();
  renderQuiz();
}

function filterTips(cat, btn) {
  state.tipFilter = cat;
  document.querySelectorAll('#page-training .filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTipsList();
}

async function renderTipsList() {
  const cat = state.tipFilter;
  let list = await api(`/training/tips${cat && cat !== 'all' ? '?category=' + cat : ''}`);
  if (!list) list = cat === 'all' ? store.salesTips : store.salesTips.filter(t => t.category === cat);
  document.getElementById('tipsList').innerHTML = list.map(t => `
    <div class="tip-item" onclick="toggleTip(this)">
      <div class="tip-header">
        <span class="tip-icon">${t.icon}</span>
        <span class="tip-title">${t.title}</span>
        <span class="tip-arrow">▶</span>
      </div>
      <div class="tip-body">${t.content.replace(/\n/g, '<br>')}</div>
    </div>`).join('');
}

function toggleTip(el) {
  el.classList.toggle('expanded');
}

async function renderQuiz() {
  const quiz = await api('/training/quiz');
  const local = store.quiz[Math.floor(Math.random() * store.quiz.length)];
  if (quiz) {
    state.currentQuiz = { id: quiz.id, q: quiz.question, opts: JSON.parse(quiz.options), correct: quiz.correctIndex, explain: quiz.explanation };
  } else {
    state.currentQuiz = local;
  }
  state.quizAnswered = false;
  state.quizSelected = null;
  document.getElementById('quizArea').innerHTML = `
    <div class="quiz-question">${state.currentQuiz.q}</div>
    <div class="quiz-options">
      ${state.currentQuiz.opts.map((o, i) => `
        <div class="quiz-opt" onclick="selectQuizOpt(this, ${i})">${String.fromCharCode(65 + i)}. ${o}</div>`).join('')}
    </div>
    <button class="quiz-submit" onclick="submitQuiz()">提交答案</button>
    <div id="quizResult"></div>
  `;
}

function selectQuizOpt(el, idx) {
  if (state.quizAnswered) return;
  document.querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  state.quizSelected = idx;
}

async function submitQuiz() {
  if (state.quizAnswered || state.quizSelected === null) { showToast('请先选择答案'); return; }
  state.quizAnswered = true;

  let result;
  if (state.currentQuiz.id) {
    result = await api(`/training/quiz/${state.currentQuiz.id}/submit`, {
      method: 'POST', body: JSON.stringify({ selected: state.quizSelected })
    });
  }
  const correct = result ? result.correct : (state.quizSelected === state.currentQuiz.correct);
  const explain = result ? result.explanation : state.currentQuiz.explain;
  const xp = result ? result.xpEarned : (correct ? 20 : 0);

  const opts = document.querySelectorAll('.quiz-opt');
  opts[state.currentQuiz.correct].classList.add('correct');
  if (!correct) opts[state.quizSelected].classList.add('wrong');
  if (!result && correct) store.user.xp += 20;

  document.getElementById('quizResult').innerHTML = `
    <div class="quiz-result ${correct ? 'correct' : 'wrong'}">
      ${correct ? `🎉 回答正确！+${xp} XP` : '❌ 回答错误'}<br>
      <strong>解析：</strong>${explain}
    </div>
    <button class="quiz-submit" style="margin-top:10px;background:rgba(255,255,255,0.1)" onclick="renderQuiz()">
      下一题 →
    </button>
  `;
  document.getElementById('userXP').textContent = store.user.xp;
}

// ===== MODALS =====
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

// ===== TOAST =====
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

// ===== NOTIFICATIONS =====
function showNotifications() {
  document.getElementById('notifDot').style.display = 'none';
  showToast('📬 3条新通知：订单更新、排名变化、培训提醒');
}

// ===== INIT =====
function init() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  document.getElementById('headerName').textContent = store.user.name;
  document.getElementById('headerAvatar').textContent = store.user.avatar;
  document.getElementById('streakCount').textContent = store.user.streak + '天';
  document.getElementById('pendingBadge').textContent = store.orders.filter(o => o.status === 'pending').length;

  setTimeout(() => {
    document.getElementById('splash').style.opacity = '0';
    document.getElementById('splash').style.transition = 'opacity 0.5s';
    setTimeout(() => {
      document.getElementById('splash').style.display = 'none';
      document.getElementById('app').classList.remove('hidden');
      renderDashboard();
    }, 500);
  }, 2000);
}

document.addEventListener('DOMContentLoaded', init);
