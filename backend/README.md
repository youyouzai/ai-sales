# 销售之星 - Java 后端

Spring Boot 3 + MySQL 8 RESTful API

## 快速启动

### 1. 初始化数据库

```bash
mysql -u root -p < src/main/resources/db/schema.sql
mysql -u root -p < src/main/resources/db/data.sql
```

### 2. 修改数据库配置

编辑 `src/main/resources/application.yml`，修改数据库连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/sales_star?...
    username: root
    password: 你的密码
```

### 3. 启动服务

```bash
mvn spring-boot:run
```

服务启动后访问：http://localhost:8080

---

## API 文档

所有接口统一返回格式：
```json
{ "code": 200, "message": "success", "data": {...} }
```

> 当前版本使用 `userId=1` (张伟) 作为默认用户。

### 首页仪表盘

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/dashboard?userId=1` | 获取仪表盘全量数据 |

### 商品管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/products` | 商品列表（支持 brand/keyword/sort 参数） |
| GET | `/api/products/{id}` | 商品详情 |

**查询参数：**
- `brand=Apple`（品牌筛选）
- `keyword=iPhone`（关键词搜索）
- `sort=profit_desc/profit_asc/price_desc/price_asc/stock_desc`

### 订单管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/orders?userId=1&status=pending` | 订单列表 |
| GET | `/api/orders/stats?userId=1` | 各状态订单统计 |
| POST | `/api/orders?userId=1` | 新建订单 |
| PUT | `/api/orders/{id}/status` | 更新订单状态 |

**新建订单 Body：**
```json
{
  "customerName": "李明",
  "customerId": 1,
  "productId": 1,
  "quantity": 1,
  "note": "备注"
}
```

**更新状态 Body：**
```json
{ "status": "completed" }
```

### 客户管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/customers?userId=1&segment=hot` | 客户列表 |
| GET | `/api/customers/{id}` | 客户详情（含拜访记录） |
| POST | `/api/customers?userId=1` | 新增客户 |
| POST | `/api/customers/{id}/visits` | 添加拜访记录 |

**添加拜访 Body：**
```json
{ "type": "visit", "note": "拜访内容" }
```

### 收益与排行榜

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/earnings?userId=1` | 收益详情（含里程碑、历史） |
| GET | `/api/leaderboard?userId=1&period=2024-01` | 排行榜 |

### 培训中心

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/training/tips?category=open` | 销售技巧列表 |
| GET | `/api/training/quiz` | 随机获取一道题目 |
| POST | `/api/training/quiz/{id}/submit?userId=1` | 提交答案 |
| GET | `/api/training/path` | 学习路径 |
| GET | `/api/training/daily-tip` | 每日一句 |

### 任务管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/tasks?userId=1` | 获取今日任务 |
| PUT | `/api/tasks/{id}/toggle?userId=1` | 切换任务完成状态 |

---

## 项目结构

```
backend/
├── pom.xml
└── src/main/
    ├── java/com/salesstar/
    │   ├── SalesStarApplication.java
    │   ├── config/CorsConfig.java
    │   ├── controller/          # REST 接口层
    │   ├── service/             # 业务逻辑层
    │   ├── repository/          # 数据访问层 (JPA)
    │   ├── entity/              # 数据库实体
    │   └── dto/                 # 数据传输对象
    └── resources/
        ├── application.yml      # 配置文件
        └── db/
            ├── schema.sql       # 建表语句
            └── data.sql         # 初始数据
```
