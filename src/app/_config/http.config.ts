export default {
    login: {url: '/partner-api/login', type: 'post'},           // 登陆
    sendCode: {url: '/partner-api/sendCode', type: 'post'},                 // 发送安全吗
    menus: {url: '/partner-api/menus', type: 'post'},           // 获取右侧菜单
    online: {url: '/partner-api/online'},                       // 获取在线人数
    editPassword: {url: '/partner-api/admin/editPassword'},     // 修改密码
    getPartnerLogo: {url: '/partner-api/system/getPartnerLogo'},     // 管理员头像
    adminAvatarImgDel: {url: '/partner-api/system/adminAvatarImgDel'},     // 头像删除
    getTimeNow: {url: '/partner-api/getTimeNow'},     // 时间戳获取

    /** ========================== 配置列表 ======================== */
    configureList: {url: '/partner-api/configureList'},                       // 获取配置列表
    configureAdd: {url: '/partner-api/configureAdd/'},                        // 新增或编辑配置
    configureStatus: {url: '/partner-api/configureStatus/'},                  // 更改配置状态
    configureFlush: {url: '/partner-api/configureFlush'},                     // 刷新

    telegramList: {url: '/partner-api/admin/partnerTelegramChannelList'},           // 渠道列表
    telegramEdit: {url: '/partner-api/admin/partnerTelegramChannelEdit/'},          // 渠道编辑
    telegramGenId: {url: '/partner-api/admin/partnerTelegramChannelGenId/'},        // 生成ID

    /** ========================== 运营管理 ======================== */
    noticeList: {url: '/partner-api/system/noticeList'}, // 公告列表
    noticeAdd: {url: '/partner-api/system/noticeAdd/'}, // 添加/编辑公告 0添加 1编辑
    noticeStatus: {url: '/partner-api/system/noticeStatus/'}, // 更改通知状态
    noticeTop: {url: '/partner-api/system/noticeTop/'}, // 公告置顶
    noticeDel: {url: '/partner-api/system/noticeDel'}, // 公告删除
    noticeFlush: {url: '/partner-api/system/noticeFlush'}, // 刷新通知
    playerFrozen: {url: '/partner-api/player/playerFrozen/'}, // 冻结审核
    reviewList: {url: '/partner-api/player/reviewList'}, // 审核管理
    reviewProcess: {url: '/partner-api/player/reviewProcess/'}, // 通过审核
    reviewDetail: {url: '/partner-api/player/reviewDetail/'}, // 审核详情
    menuList: {url: '/partner-api/partner/partnerMenuConfigList'}, // 菜单列表
    menuStatus: {url: '/partner-api/admin/menuStatus/'}, // 菜单设置
    logoImage: {url: '/partner-api/system/logoImage'}, // 获取首页logo
    qrImage: {url: '/partner-api/admin/qrImage'}, // 获取二维码
    logoDel: {url: '/partner-api/system/logoDel'}, // 删除图片
    qrCodeDel: {url: '/partner-api/admin/qrCodeDel'}, // 删除二维码
    partnerAdminNavigationList: {url: '/partner-api/admin/partnerAdminNavigationList'}, // 获取导航菜单
    partnerAdminNavigationSet: {url: '/partner-api/admin/partnerAdminNavigationSet/'}, // 添加或编辑 导航菜单
    partnerAdminNavigationDel: {url: '/partner-api/admin/partnerAdminNavigationDel/'}, // 删除导航菜单
    partnerModelList: {url: '/partner-api/admin/partnerModelList'}, // 首页配置 首页模块列表
    partnerModuleSet: {url: '/partner-api/admin/partnerModuleSet/'}, // 首页配置 首页模块 添加 编辑
    partnerModuleDel: {url: '/partner-api/admin/partnerModuleDel/'}, // 首页配置 首页模块 删除
    partnerAdminHomeModuleSet: {url: '/partner-api/admin/partnerAdminHomeModuleSet/'}, // 首页配置设置个数
    partnerAdminCacheClean: {url: '/partner-api/admin/partnerAdminCacheClean'}, // 首页配置刷新前台缓存
    partnerAdminHomeList: {url: '/partner-api/admin/partnerAdminHomeList'}, // 模块列表
    partnerAdminHomeSet: {url: '/partner-api/admin/partnerAdminHomeSet/'}, // 模块新增 编辑
    partnerGetModule: {url: '/partner-api/admin/partnerGetModule/'}, // 新增下拉
    partnerAdminHomeContentList: {url: '/partner-api/admin/partnerAdminHomeContentList/'}, // 模块列表内容
    partnerAdminHomeDel: {url: '/partner-api/admin/partnerAdminHomeDel/'}, // 删除模块
    csSet: {url: '/partner-api/admin/csSet/'}, // 设置客服
    csList: {url: '/partner-api/admin/csList'}, // 客服列表
    partnerAdminTelegram: {url: '/partner-api/admin/partnerAdminTelegram'}, // 纸飞机机器人
    saveCheckUser: {url: '/partner-api/admin/saveCheckUser'}, // 设置审核权限
    getCheckUser: {url: '/partner-api/admin/getCheckUser'}, // 获取审核权限
    delCheckUser: {url: '/partner-api/admin/delCheckUser'}, // 删除审核权限
    getCheckType: {url: '/partner-api/admin/getCheckType'}, // 获取审核类型

    setAdminPassword: {url: '/partner-api/admin/setAdminPassword/'}, // 修改其他管理员登录密码
    setAdminFundPassword: {url: '/partner-api/admin/setAdminFundPassword/'}, // 修改其他管理员资金密码

    avatarImgUpload: {url: '/partner-api/system/avatarImgUpload'}, // 头像上传
    playerAvatarList: {url: '/partner-api/system/playerAvatarList'}, // 头像列表
    avatarImgDel: {url: '/partner-api/system/avatarImgDel'}, // 头像删除
    setAvatar: {url: '/partner-api/system/setAvatar'}, // 头像设置

    MessageList: {url: '/partner-api/system/getList'}, // 站内信
    MessageDel: {url: '/partner-api/system/contentDel'}, // 删除站内信
    MessageAdd: {url: '/partner-api/system/addMessageContent'}, // 添加站内信

    getTemplate: {url: '/partner-api/getTemplate'}, // 模板列表
    setTemplate: {url: '/partner-api/setTemplate'}, // 模板编辑

    colorConfigureList: {url: '/partner-api/colorConfigureList'}, // 配色列表
    colorConfigureEdit: {url: '/partner-api/colorConfigureEdit'}, // 配色列表添加
    colorConfigureDelete: {url: '/partner-api/colorConfigureDelete'}, // 配色列表删除
    themeOpen: {url: '/partner-api/themeOpen'}, // 主题开关

    delAdminUser: {url: '/partner-api/admin/delAdminUser'}, // 删除管理员

    getAdvertising: {url: '/partner-api/admin/getAdvertising'}, // 40-商户广告位获取
    saveAdvertising: {url: '/partner-api/admin/saveAdvertising'}, // 41-商户广告位设置
    delAdvertising: {url: '/partner-api/admin/delAdvertising'}, // 42-商户广告位删除
    getType: {url: '/partner-api/admin/getType'}, // 43-商户广告位获取类型


    /** ========================== 彩票游戏 ======================== */
    lotteryList: {url: '/partner-api/lottery/lotteryList'},           // 彩票列表
    lotteryDetail: {url: '/partner-api/lottery/lotteryDetail/'},      // 彩种详情
    lotteryStatus: {url: '/partner-api/lottery/lotteryStatus/'},      // 修改彩票状态
    lotteryPopular: {url: '/partner-api/lottery/lotteryPopular/'},    // 修改彩票热门
    lotterySet: {url: '/partner-api/lottery/lotteryInfoSet/'},        // 设置
    lotterySetRate: {url: '/partner-api/lottery/lotterySetRate/'},    // 设置水率

    methodList: {url: '/partner-api/lottery/methodList'},                   // 玩法列表
    methodDetail: {url: '/partner-api/lottery/methodDetail/'},              // 玩法详情
    methodChangeStatus: {url: '/partner-api/lottery/methodStatus/'},        // 玩法状态修改
    methodSet: {url: '/partner-api/lottery/methodSet/'},                    // 玩法设置

    projectList: {url: '/partner-api/lottery/projectList'},                     // 订单列表
    projectDetail: {url: '/partner-api/lottery/projectDetail/'},                // 订单详情
    projectCommission: {url: '/partner-api/lottery/projectCommission/'},        // 返点
    projectAccountChange: {url: '/partner-api/lottery/projectAccountChange/'},  // 帐变
    projectCancel: {url: '/partner-api/lottery/cancelProject/'},                // 撤单

    issueList: {url: '/partner-api/lottery/issueList'},                         // 奖期列表
    issueEncode: {url: '/partner-api/lottery/issueEncode/'},                    // 奖期录号
    issueCancel: {url: '/partner-api/lottery/issueCancel/'},                    // 奖期撤单
    issueRuleList: {url: '/partner-api/lottery/issueRuleList'},                 // 奖期规则

    changePop: {url: '/partner-api/lottery/lotteryPopSet/'},      // 首页 公告
    indexMethodSet: {url: '/partner-api/lottery/methodSet/'},     // 首页 流行

    traceList: {url: '/partner-api/lottery/traceList'},                     // 追号列表
    traceDetail: {url: '/partner-api/lottery/traceDetail/'},                // 追号详情
    traceCancel: {url: '/partner-api/lottery/cancelTrace/'},                // 追号撤销
    traceDetailCancel: {url: '/partner-api/lottery/cancelTraceDetail/'},    // 追号详情撤销

    commissionList: {url: '/partner-api/lottery/commissionList'},           // 返点列表

    rateOpen: {url: '/partner-api/lottery/rateOpen'},           // 控水

    /** ========================== 日志管理 ======================== */
    accessLogList: {url: '/partner-api/admin/accessLogList'}, // 管理-访问日志
    adminUserBehaviorList: {url: '/partner-api/admin/adminUserBehaviorList'}, // 管理-行为日志
    userIpLogList: {url: '/partner-api/player/userIpLogList'}, // 玩家-IP日志
    userIp: {url: '/partner-api/player/userIp'}, // 玩家-IP日志
    userPlayerLogList: {url: '/partner-api/player/userPlayerLogList'}, // 玩家-访问日志
    userPlayerDetail: {url: '/partner-api/player/userPlayerDetail'}, // 玩家-访问日志

    /** ========================== 娱乐城 ======================== */
    getPlatType: {url: '/partner-api/casino/getPlatType'}, // 平台列表
    getGameList: {url: '/partner-api/casino/getGameList'}, // 玩法列表
    getApiLog: {url: '/partner-api/casino/getApiLog'}, // 接口日志
    getTransfer: {url: '/partner-api/casino/getTransfer'}, // 转账记录
    setHomeGame: {url: '/partner-api/casino/setHomeGame'}, // 设置首页显示游戏
    setHomePlat: {url: '/partner-api/casino/setHomePlat'}, // 设置首页游戏显示类型
    callGameList: {url: '/partner-api/casino/callGameList'}, // 数据同步
    seriesLists: {url: '/partner-api/casino/seriesLists'}, // 数据同步
    getBetLog: {url: '/partner-api/casino/getBetLog'}, // 注单列表
    gameControl: {url: '/partner-api/casino/gameControl'}, // 游戏状态修改
    uploadImage: {url: '/partner-api/casino/uploadImage'}, // 图片上传
    deleteImage: {url: '/partner-api/casino/deleteImage'}, // 图片删除
    casinoGameImgDelete: {url: '/partner-api/casino/casinoGameImgDelete'}, // 游戏图片删除
    lotteryAdImgDelete: {url: '/partner-api/lottery/lotteryAdImgDelete'}, // 图片上传
    adImgDelete: {url: '/partner-api/casino/adImgDelete'}, // 删除
    getStatistics: {url: '/partner-api/casino/getStatistics'}, // 统计列表

    /** ========================== 后台管理 ======================== */
    adminUserList: {url: '/partner-api/admin/adminUserList'}, // 商户列表
    adminUserAdd: {url: '/partner-api/admin/adminUserAdd'}, // 添加管理页
    adminUserStatus: {url: '/partner-api/admin/adminUserStatus/'}, // 修改用户状态
    adminGroupList: {url: '/partner-api/admin/adminGroupList'}, // 获取商户管理组列表
    adminGroupAdd: {url: '/partner-api/admin/adminGroupAdd'}, // 创建管理组
    adminGroupAcl: {url: '/partner-api/partner/adminGroupAcl/'}, // 查看管理组权限
    adminGroupSetAcl: {url: '/partner-api/admin/adminGroupSetAcl/'}, // 管理组权限设置
    adminGroupDel: {url: '/partner-api/admin/adminGroupDel/'}, // 管理组删除
    domainList: {url: '/partner-api/admin/domainList'}, // 域名列表
    domainAdd: {url: '/partner-api/admin/domainAdd/1'}, // 新增域名
    domainStatus: {url: '/partner-api/admin/domainStatus/1'}, // 修改域名状态

    /** ========================== 玩家管理 ======================== */
    playerList: {url: '/partner-api/player/playerList'}, // 玩家列表
    playerUnfrozen: {url: '/partner-api/player/playerUnfrozen/'}, // 玩家解冻
    playerAddTop: {url: '/partner-api/player/playerAddTop'}, // 玩家列表 添加直属
    playerStatus: {url: '/partner-api/player/playerStatus/'}, // 设置玩家状态
    playerCardList: {url: '/partner-api/player/playerCardList'}, // _银行卡列表
    playerCardAdd: {url: '/partner-api/player/playerCardAdd/'}, // 添加_银行卡
    playerCardEdit: {url: '/partner-api/player/editPlayerCard/'}, // 编辑_银行卡
    playerCardDetail: {url: '/partner-api/player/playerCardDetail/'}, // _银行卡详情
    cardStatus: {url: '/partner-api/player/cardStatus/'}, // 银行卡开关
    allowedTransfer: {url: '/partner-api/player/allowedTransfer/'}, // 上下级转账开关
    playerCardDel: {url: '/partner-api/player/playerCardDel/'}, // 删除银行卡
    playerVipConfig: {url: '/partner-api/player/playerVipConfig'}, // 会员等级列表
    addPlayerVipConfig: {url: '/partner-api/player/addPlayerVipConfig'}, // 添加/编辑 会员等级
    setPlayerVipLevel: {url: '/partner-api/player/setPlayerVipLevel'}, // 直接设置会员vip等级
    playerVipConfigDetail: {url: '/partner-api/player/playerVipConfigDetail/'}, // 会员等级详情

    salaryReportList: {url: '/partner-api/player/salaryReportList'},      // 代理日工资
    salaryReportSend: {url: '/partner-api/player/salaryReportSend'},      // 发放日工资

    dividendReportList: {url: '/partner-api/player/dividendReportList'},  // 代理分红
    dividendReportSend: {url: '/partner-api/player/dividendReportSend'},  // 发放分红

    playerDetail: {url: '/partner-api/player/playerDetail/'}, // 玩家详情
    playerPassword: {url: '/partner-api/player/playerPassword/'}, // 修改密码
    playerTransfer: {url: '/partner-api/player/playerTransfer/'}, // 资金
    playerMark: {url: '/partner-api/player/playerMark/'}, // 玩家提现备注
    bonusSet: {url: '/partner-api/player/bonusSet/'}, // 代理分红
    salarySet: {url: '/partner-api/player/salarySet/'}, // 代理日工资
    transferFrom: {url: '/partner-api/player/transferFrom/'}, // 上级转账


    /** ========================== 财务管理 ======================== */
    paymentTypeList: {url: '/partner-api/finance/channelType/list'}, // 支付类型 列表
    paymentTypeAdd: {url: '/partner-api/finance/channelType/create/'},    // 支付类型 添加
    paymentTypeEdit: {url: '/partner-api/finance/channelType/create/'},    // 支付类型 编辑
    paymentTypeDel: {url: '/partner-api/finance/channelType/del'},    // 支付类型 删除

    platformList: {url: '/partner-api/finance/platform/list'},    // 支付厂商 列表
    platformAdd: {url: '/partner-api/finance/platform/create'},    // 支付厂商 添加
    platformEdit: {url: '/partner-api/finance/platform/edit'},    // 支付厂商 编辑
    platformDel: {url: '/partner-api/finance/platform/del'},    // 支付厂商 删除

    platformAccountChannelList: {url: '/partner-api/finance/platformAccountChannel/list'},    // 支付厂商开放渠道 列表
    platformAccountChannelAdd: {url: '/partner-api/finance/platformAccountChannel/create/'},    // 支付厂商开放渠道 添加
    platformAccountChannelEdit: {url: '/partner-api/finance/platformAccountChannel/edit/'},    // 支付厂商开放渠道 编辑
    platformAccountChannelDel: {url: '/partner-api/finance/platformAccountChannel/del'},    // 支付厂商开放渠道 删除
    platformAccountChannelStatus: {url: '/partner-api/finance/platformAccountChannel/status'},    // 支付厂商开放渠道 修改状态

    platformAccountList: {url: '/partner-api/finance/platformAccount/list'},    // 支付账户 列表
    platformAccountAdd: {url: '/partner-api/finance/platformAccount/create/'},    // 支付账户 添加
    platformAccountEdit: {url: '/partner-api/finance/platformAccount/edit'},    // 支付账户 编辑
    platformAccountDel: {url: '/partner-api/finance/platformAccount/del/'},    // 支付账户 删除
    platformAccountStatus: {url: '/partner-api/finance/platformAccount/status/'},    // 支付账户 修改状态
    platformAccountForeignChannel: {url: '/partner-api/finance/platformAccount/foreign_channel'},    // 支付账户 支付渠道

    platformChannelList: {url: '/partner-api/finance/platformChannel/list'},    // 支付账户开放渠道 列表
    platformChannelAdd: {url: '/partner-api/finance/platformChannel/create'},    // 支付账户开放渠道 添加
    platformChannelEdit: {url: '/partner-api/finance/platformChannel/edit'},    // 支付账户开放渠道 编辑
    platformChannelDel: {url: '/partner-api/finance/platformChannel/del'},    // 支付账户开放渠道 删除
    platformChannelStatus: {url: '/partner-api/finance/platformChannel/status/'},    // 支付账户开放渠道 修改状态

    rechargeList: {url: '/partner-api/rechargeList'}, // 充值列表
    rechargeLog: {url: '/partner-api/rechargeLog/'}, // 充值日志
    rechargeHand: {url: '/partner-api/rechargeHand/'}, // 人工充值
    rechargeExport: {url: '/partner-api/rechargeExport'}, // 导出充值列表

    withdrawList: {url: '/partner-api/withdrawList'}, // 提现列表
    viewWithdrawList: {url: '/partner-api/viewWithdrawList/'}, // 提现详情
    withdrawHand: {url: '/partner-api/withdrawHand/'}, // 人工审核
    withdrawCheckProcess: {url: '/partner-api/withdrawCheckProcess/'}, // 审核处理
    withdrawGenOrder: {url: '/partner-api/withdrawGenOrder'}, // 生成提现订单
    withdrawExport: {url: '/partner-api/withdrawExport'}, // 导出提现数据
    withdrawLog: {url: '/partner-api/withdrawLog/'}, // 提现日志

    updateForeignChannel: {url: '/partner-api/finance/platformAccount/updateForeignChannel/'}, // 更新支付渠道
    foreign_channel: {url: '/partner-api/finance/platformAccount/foreign_channel'}, // 获取支付渠道
    updateRechargeChannel: {url: '/partner-api/finance/platformAccount/updateRechargeChannel'},
    updatePaymentChannel: {url: '/partner-api/finance/platformAccount/updatePaymentChannel'},

    rechargeLogList: {url: '/partner-api/rechargeLogList'}, // 充值日志-列表
    rechargeLogDetail: {url: '/partner-api/rechargeLog/'}, // 充值详情
    withdrawLogList: {url: '/partner-api/withdrawLogList'}, // 提现日志-列表
    withdrawLogDetail: {url: '/partner-api/withdrawLog/'}, // 提现详情

    listChild: {url: '/partner-api/finance/platform/listChild/'}, // 选项拉取

    withdrawPassedList: {url: '/partner-api/withdrawPassedList/'}, // 提现列表(审核通过)
    withdrawFailList: {url: '/partner-api/withdrawFailList/'}, // 提现列表(除审核通过)
    viewWithdrawHandList: {url: '/partner-api/viewWithdrawHandList/'}, // 人工提现列表导出

    /** ========================== 活动信息管理 ======================== */
    activityInfoList: {url: '/partner-api/activity-rule/getList'},    // 列表
    activityInfoAdd: {url: '/partner-api/activity/ruleSet/'},    // 添加
    activityInfoEdit: {url: '/partner-api/activity/ruleSet/'},    // 编辑
    activityInfoDel: {url: '/partner-api/activity/ruleDel/'},    // 删除
    activityInfoAll: {url: '/partner-api/activity-info/all'},    // 列表 不分页

    checkGetLists: {url: '/partner-api/activity/check/getLists'}, // 活动日志
    getParams: {url: '/partner-api/activity/check/getParams'}, // 获取日志搜索条件
    activityCheck: {url: '/partner-api/activity/check/'}, // 获取日志搜索条件
    /** ========================== 活动奖品管理 ======================== */
    // 列表
    activityPrizeList: {url: '/partner-api/activity/prize/getLists'},
    // 添加
    activityPrizeAdd: {url: '/partner-api/activity/prize/set/'},
    // 删除
    activityPrizeDel: {url: '/partner-api/activity/prize/del/'},
    /** ========================== 活动规则管理 ======================== */
    // 列表
    activityRuleList: {url: '/partner-api/activity-rule/index'},
    // 规则列表
    activityRuleGetList: {url: '/partner-api/activity-rule/getRule'},
    // 添加
    activityRuleAdd: {url: '/partner-api/activity/ruleSet/'},
    // 编辑
    activityRuleEdit: {url: '/partner-api/activity/ruleSet/'},
    // 删除
    activityRuleDel: {url: '/partner-api/activity/ruleDel/'},

    /** ========================== 报表管理 ======================== */
    statUserDayList: {url: '/partner-api/report/statUserDayList'},      // 用户日结算
    statUserDayCheck: {url: '/partner-api/report/statUserDayCheck/'},   // 检测

    // 用户总结算
    statUserList: {url: '/partner-api/report/statUserList'},
    // 彩种日结算
    lotteryDayList: {url: '/partner-api/report/lotteryDayList'},
    // 帐变列表
    accountChangeList: {url: '/partner-api/report/accountChangeList'},
    // 帐变列表 - Project 详情
    accountChangeProjectDetail: {url: '/partner-api/report/accountChangeProjectDetail'},

    getDailyStatistical: {url: '/partner-api/report/getDailyStatistical'},

    /** ========================== 帮助中心 ======================== */
    helpMenu: {url: '/partner-api/system/helpMenu'}, // 帮助中心菜单
    helpMenuAdd: {url: '/partner-api/system/helpMenuAdd'}, // 添加帮助中心分类
    helpMenuList: {url: '/partner-api/system/helpMenuList'}, // 帮助中心内容
    addHelpContent: {url: '/partner-api/system/addHelpContent/'}, // 添加帮助内容
    helpMenuDel: {url: '/partner-api/system/helpMenuDel/'}, // 删除帮助内容
    helpUpLoadImg: {url: '/partner-api/system/helpUpLoadImg/'}, // 帮助中心图片上传
    editHelp: {url: '/partner-api/system/editHelp/'}, // 修改帮助内容
    contentDel: {url: '/partner-api/system/contentDel/'}, // 删除
    helpImgDel: {url: '/partner-api/system/helpImgDel'}, // 图片删除


    /** ========================== 历史数据 ======================== */
    funcChange: {url: '/partner-api/backup/funcChange'}, // 帐变历史记录
    partnerVisit: {url: '/partner-api/backup/partnerVisit'}, // 商户访问历史记录
    partnerBehavior: {url: '/partner-api/backup/partnerBehavior'}, // 商户行为历史记录
    playerVisit: {url: '/partner-api/backup/playerVisit'}, // 玩家访问历史记录
    playerIp: {url: '/partner-api/backup/playerIp'}, // 玩家IP历史记录
    playerCommission: {url: '/partner-api/backup/playerCommission'}, // 玩家返点历史记录
    playerProject: {url: '/partner-api/backup/playerProject'}, // 玩家投注历史记录
    playerTrace: {url: '/partner-api/backup/playerTrace'}, // 玩家追号历史记录
    issuesList: {url: '/partner-api/backup/issuesList'}, // 奖期列表历史记录
};
