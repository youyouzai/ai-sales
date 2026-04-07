-- ============================================================
-- 销售之星 - 数据库建表脚本
-- MySQL 8.0+
-- 执行方式：mysql -u root -p sales_star < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS sales_star DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sales_star;

-- 销售员表
CREATE TABLE IF NOT EXISTS users (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(50)  NOT NULL COMMENT '姓名',
    avatar       VARCHAR(10)           COMMENT '头像文字',
    role         VARCHAR(100)          COMMENT '职位',
    base_salary  INT          NOT NULL DEFAULT 0  COMMENT '底薪（分）',
    commission   INT          NOT NULL DEFAULT 0  COMMENT '当月提成（分）',
    bonus        INT          NOT NULL DEFAULT 0  COMMENT '当月奖金（分）',
    target       INT          NOT NULL DEFAULT 50 COMMENT '月销售目标台数',
    done         INT          NOT NULL DEFAULT 0  COMMENT '当月已完成台数',
    xp           INT          NOT NULL DEFAULT 0  COMMENT '经验值',
    streak       INT          NOT NULL DEFAULT 0  COMMENT '连续打卡天数',
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='销售员';

-- 商品表
CREATE TABLE IF NOT EXISTS products (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(100) NOT NULL COMMENT '商品名称',
    brand          VARCHAR(50)           COMMENT '品牌',
    emoji          VARCHAR(10)           COMMENT '图标',
    price          INT          NOT NULL COMMENT '零售价（分）',
    cost           INT          NOT NULL COMMENT '进价（分）',
    stock          INT          NOT NULL DEFAULT 0 COMMENT '库存',
    sold           INT          NOT NULL DEFAULT 0 COMMENT '已售',
    tags           VARCHAR(200)          COMMENT '标签，逗号分隔',
    description    TEXT                  COMMENT '描述',
    specs          JSON                  COMMENT '规格参数',
    selling_points JSON                  COMMENT '销售话术要点',
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='手机商品';

-- 客户表
CREATE TABLE IF NOT EXISTS customers (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id        BIGINT       NOT NULL COMMENT '所属销售员',
    name           VARCHAR(50)  NOT NULL COMMENT '姓名',
    phone          VARCHAR(20)           COMMENT '手机号',
    age            INT                   COMMENT '年龄',
    job            VARCHAR(100)          COMMENT '职业',
    budget         VARCHAR(20)           COMMENT '预算范围',
    segment        VARCHAR(10)  NOT NULL DEFAULT 'warm' COMMENT 'hot/warm/cold/vip',
    tags           VARCHAR(500)          COMMENT '标签，逗号分隔',
    budget_actual  INT          NOT NULL DEFAULT 0 COMMENT '历史成交金额（分）',
    purchased      VARCHAR(500)          COMMENT '历史购买记录',
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB COMMENT='客户';

-- 拜访记录表
CREATE TABLE IF NOT EXISTS customer_visits (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT       NOT NULL COMMENT '客户ID',
    type        VARCHAR(20)  NOT NULL DEFAULT 'visit' COMMENT 'visit/call/wechat',
    visit_date  DATE         NOT NULL COMMENT '拜访日期',
    note        TEXT                  COMMENT '拜访内容',
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='客户拜访记录';

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no      VARCHAR(30)  NOT NULL UNIQUE COMMENT '订单号',
    user_id       BIGINT       NOT NULL COMMENT '销售员',
    customer_id   BIGINT                COMMENT '客户ID',
    customer_name VARCHAR(50)           COMMENT '客户姓名（快照）',
    product_id    BIGINT       NOT NULL COMMENT '商品ID',
    quantity      INT          NOT NULL DEFAULT 1 COMMENT '数量',
    amount        INT          NOT NULL COMMENT '订单金额（分）',
    commission    INT          NOT NULL DEFAULT 0 COMMENT '提成（分）',
    status        VARCHAR(20)  NOT NULL DEFAULT 'pending' COMMENT 'pending/processing/completed/cancelled',
    order_date    DATE         NOT NULL COMMENT '下单日期',
    note          VARCHAR(500)          COMMENT '备注',
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)    REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='订单';

-- 每日任务表
CREATE TABLE IF NOT EXISTS tasks (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT       NOT NULL COMMENT '销售员',
    content    VARCHAR(200) NOT NULL COMMENT '任务内容',
    done       TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '是否完成',
    xp         INT          NOT NULL DEFAULT 10 COMMENT '完成可获得XP',
    task_date  DATE         NOT NULL COMMENT '任务日期',
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB COMMENT='每日任务';

-- 销售技巧表
CREATE TABLE IF NOT EXISTS sales_tips (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    category   VARCHAR(20)  NOT NULL COMMENT 'open/objection/close/followup',
    icon       VARCHAR(10)           COMMENT '图标',
    title      VARCHAR(100) NOT NULL COMMENT '标题',
    content    TEXT         NOT NULL COMMENT '内容',
    sort_order INT          NOT NULL DEFAULT 0 COMMENT '排序'
) ENGINE=InnoDB COMMENT='销售技巧';

-- 测验题目表
CREATE TABLE IF NOT EXISTS quiz_questions (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    question      TEXT         NOT NULL COMMENT '题目',
    options       JSON         NOT NULL COMMENT '选项数组',
    correct_index INT          NOT NULL COMMENT '正确答案索引(0-based)',
    explanation   TEXT                  COMMENT '解析',
    xp_reward     INT          NOT NULL DEFAULT 20 COMMENT '答对奖励XP'
) ENGINE=InnoDB COMMENT='测验题目';

-- 学习路径表
CREATE TABLE IF NOT EXISTS learning_paths (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    icon       VARCHAR(10)           COMMENT '图标',
    title      VARCHAR(100) NOT NULL COMMENT '标题',
    subtitle   VARCHAR(200)          COMMENT '副标题',
    xp_reward  INT          NOT NULL DEFAULT 50 COMMENT '完成奖励XP',
    done       TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '是否已完成',
    active     TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '是否当前进行',
    sort_order INT          NOT NULL DEFAULT 0 COMMENT '排序'
) ENGINE=InnoDB COMMENT='学习路径';

-- 排行榜表
CREATE TABLE IF NOT EXISTS leaderboard (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT       NOT NULL COMMENT '销售员',
    period       VARCHAR(10)  NOT NULL COMMENT '统计周期 如2024-01',
    sales_count  INT          NOT NULL DEFAULT 0 COMMENT '销售台数',
    sales_amount BIGINT       NOT NULL DEFAULT 0 COMMENT '销售总额（分）',
    `rank`       INT          NOT NULL DEFAULT 99 COMMENT '排名',
    trend        VARCHAR(10)           COMMENT 'up/down/neutral',
    UNIQUE KEY uk_user_period (user_id, period),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB COMMENT='销售排行榜';
