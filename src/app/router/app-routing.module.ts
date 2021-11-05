import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../views/home/home.component';
import { LoginComponent } from '../views/login/login.component';

// 侧边菜单 管理员
import { AdminUserListComponent } from '../views/home/admin/admin-user-list/admin-user-list.component';
import { AdminGroupListComponent } from '../views/home/admin/admin-group-list/admin-group-list.component';
import { DomainListComponent } from '../views/home/admin/domain-list/domain-list.component';
import { MenuListComponent } from '../views/home/admin/menu-list/menu-list.component';

// 侧边菜单 活动管理
import { ActivityInfoComponent } from '../views/home/activity/activity-info/activity-info.component';
import { ActivityPrizeComponent } from '../views/home/activity/activity-prize/activity-prize.component';
import { ActivityRuleComponent } from '../views/home/activity/activity-rule/activity-rule.component';
import { ActivityLogListComponent } from '../views/home/activity/activity-log-list/activity-log-list.component';

// 侧边菜单 运营管理
import { ConfigureComponent } from '../views/home/system/configure/configure.component';
import { NoticeListComponent } from '../views/home/system/notice-list/notice-list.component';
import { PushTaskListComponent } from '../views/home/system/push-task-list/push-task-list.component';
import { ReviewListComponent } from '../views/home/system/review-list/review-list.component';
import { ModuleListComponent } from '../views/home/system/module-list/module-list.component';
import { LetterListComponent } from '../views/home/system/letter-list/letter-list.component';
import { MerchantsConfigComponent } from '../views/home/system/merchants-config/merchants-config.component';
import { CheckUserListComponent } from '../views/home/system/check-user-list/check-user-list.component';

// 侧边菜单 游戏管理
import { IssueListComponent } from '../views/home/game/issue-list/issue-list.component';
import { LotteryListComponent } from '../views/home/game/lottery-list/lottery-list.component';
import { IssueRuleListComponent } from '../views/home/game/issue-rule-list/issue-rule-list.component';
import { MethodListComponent } from '../views/home/game/method-list/method-list.component';
import { ProjectListComponent } from '../views/home/game/project-list/project-list.component';
import { TraceListComponent } from '../views/home/game/trace-list/trace-list.component';
import { CommissionListComponent } from '../views/home/game/commission-list/commission-list.component';

// 侧边菜单 玩家管理
import { PlayerListComponent } from '../views/home/player/player-list/player-list.component';
import { PlayerCardListComponent } from '../views/home/player/player-card-list/player-card-list.component';
import { SalaryReportListComponent } from '../views/home/player/salary-report-list/salary-report-list.component';
import { DividendReportListComponent } from '../views/home/player/dividend-report-list/dividend-report-list.component';
import { PlayerVipConfigComponent } from '../views/home/player/player-vip-config/player-vip-config.component';
import { PlayerAvatarListComponent } from '../views/home/player/player-avatar-list/player-avatar-list.component';

// 侧边菜单 报表管理
import { ReportLotteryDayListComponent } from '../views/home/report/report-lottery-day-list/report-lottery-day-list.component';
import { ReportStatUserDayComponent } from '../views/home/report/report-stat-user-day-list/report-stat-user-day.component';
import { ReportStatUserListComponent } from '../views/home/report/report-stat-user-list/report-stat-user-list.component';
import { AccountChangeListComponent } from '../views/home/report/account-change-list/account-change-list.component';
import { ProfitAndLossReportComponent } from '../views/home/report/profit-and-loss-report/profit-and-loss-report.component';

// 娱乐城
import { CasinoPlatformListComponent } from '../views/home/casino/platform-list/casino-platform-list.component';
import { CasinoMethodListComponent } from '../views/home/casino/method-list/casino-method-list.component';
import { CasinoCategoryListComponent } from '../views/home/casino/category-list/casino-category-list.component';
import { CasinoApiLogListComponent } from '../views/home/casino/api-log-list/casino-api-log-list.component';
import { CasinoTransferLogListComponent } from '../views/home/casino/transfer-log-list/casino-transfer-log-list.component';
import { CasinoBetLogComponent } from '../views/home/casino/bet-Log/casino-bet-Log.component';

// 日志管理
import { AccessLogComponent } from '../views/home/admin/access-log/access-log.component';
import { BehaviorLogComponent } from '../views/home/admin/behavior-log/behavior-log.component';
import { AdminPlayerAccessLogComponent } from '../views/home/admin/player-access-log/player-access-log.component';
import { AdminUserIpLogComponent } from '../views/home/admin/player-ip-log/player-ip-log.component';

// 财务管理
import { FinanceRechargeListComponent } from '../views/home/finance/finance-recharge-list/finance-recharge-list.component';
import { FinanceWithdrawListComponent } from '../views/home/finance/finance-withdraw-list/finance-withdraw-list.component';
import { ChannelTypeComponent } from '../views/home/finance/channel-type/channel-type.component';
import { PlatformComponent } from '../views/home/finance/platform/platform.component';
import { PlatformAccountComponent } from '../views/home/finance/platform-account/platform-account.component';
import { PlatformChannelComponent } from '../views/home/finance/platform-channel/platform-channel.component';
import { PlatformAccountChannelComponent } from '../views/home/finance/platform-account-channel/platform-account-channel.component';
import { WithdrawLogListComponent } from '../views/home/finance/withdraw-log-list/withdraw-log-list.component';
import { RechargeLogListComponent } from '../views/home/finance/recharge-log-list/recharge-log-list.component';
import { FinancewithdrawPassedListComponent } from '../views/home/finance/withdraw-passed-list/withdraw-passed-list.component';
import { FinanceWithdrawFailListComponent } from '../views/home/finance/withdraw-fail-list/withdraw-fail-list.component';
import { FinanceViewWithdrawListComponent } from '../views/home/finance/view-withdraw-list/view-withdraw-list.component';
import { ViewWithdrawHandListComponent } from '../views/home/finance/view-withdraw-hand-list/view-withdraw-hand-list.component';

// 帮助中心
import { HelpMenuComponent } from '../views/home/system/help-menu/help-menu.component';
import { HelpMenuListComponent } from '../views/home/system/help-menu-list/help-menu-list.component';

// 历史记录
import { BackupFuncChangeComponent } from '../views/home/backup/func-change/func-change.component';
import { BackupPartnerVisitComponent } from '../views/home/backup/partner-visit/partner-visit.component';
import { BackupIssuesListComponent } from '../views/home/backup/issues-list/issues-list.component';
import { BackupPartnerBehaviorComponent } from '../views/home/backup/partner-behavior/partner-behavior.component';
import { BackupPlayerCommissionComponent } from '../views/home/backup/player-commission/player-commission.component';
import { BackupPlayerIpComponent } from '../views/home/backup/player-ip/player-ip.component';
import { BackupPlayerProjectComponent } from '../views/home/backup/player-project/player-project.component';
import { BackupPlayerTraceComponent } from '../views/home/backup/player-trace/player-trace.component';
import { BackupPlayerVisitComponent } from '../views/home/backup/player-visit/player-visit.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
    data: { animation: 'login' },
    children: [
      // 财务管理
      { path: 'finance/recharge-list', component: FinanceRechargeListComponent, data: { keep: true } },
      { path: 'finance/withdraw-list', component: FinanceWithdrawListComponent, data: { keep: true } },
      { path: 'finance/channelType', component: ChannelTypeComponent, data: { keep: true } },
      { path: 'finance/platform', component: PlatformComponent, data: { keep: true } },
      { path: 'finance/platformAccount', component: PlatformAccountComponent, data: { keep: true } },
      { path: 'finance/platformChannel', component: PlatformChannelComponent, data: { keep: true } },
      { path: 'finance/platformAccountChannel', component: PlatformAccountChannelComponent, data: { keep: true } },
      { path: 'finance/withdrawLog', component: WithdrawLogListComponent, data: { keep: true } },
      { path: 'finance/rechargeLog', component: RechargeLogListComponent, data: { keep: true } },
      { path: 'finance/withdrawPassedList', component: FinancewithdrawPassedListComponent, data: { keep: true } },
      { path: 'finance/withdrawFailList', component: FinanceWithdrawFailListComponent, data: { keep: true } },
      { path: 'finance/viewWithdrawList', component: FinanceViewWithdrawListComponent, data: { keep: true } },
      { path: 'finance/viewWithdrawHandList', component: ViewWithdrawHandListComponent, data: { keep: true } },

      // // 活动管理
      { path: 'activity/activityInfo', component: ActivityInfoComponent, data: { keep: true } },
      { path: 'activity/activityPrize', component: ActivityPrizeComponent, data: { keep: true } },
      { path: 'activity/activityRule', component: ActivityRuleComponent, data: { keep: true } },
      { path: 'activity/receive-lists', component: ActivityLogListComponent, data: { keep: true } },

      // 管理
      { path: 'admin/admin-user-list', component: AdminUserListComponent, data: { keep: true } },
      { path: 'admin/admin-group-list', component: AdminGroupListComponent, data: { keep: true } },
      { path: 'admin/domain-list', component: DomainListComponent, data: { keep: true } },
      { path: 'admin/menu-list', component: MenuListComponent, data: { keep: true } },

      // 运营管理
      { path: 'system/notice-list', component: NoticeListComponent, data: { keep: true } },
      { path: 'system/configure-list', component: ConfigureComponent, data: { keep: true } },
      { path: 'system/push-task-list', component: PushTaskListComponent, data: { keep: true } },
      { path: 'system/review-list', component: ReviewListComponent, data: { keep: true } },
      { path: 'system/module-list', component: ModuleListComponent, data: { keep: true } },
      { path: 'system/get-list', component: LetterListComponent, data: { keep: true } },
      { path: 'system/merchants-config', component: MerchantsConfigComponent, data: { keep: true } },
      { path: 'admin/check-user-list', component: CheckUserListComponent, data: { keep: true } },

      // 彩票管理
      { path: 'lottery/lottery-list', component: LotteryListComponent, data: { keep: true } },
      { path: 'lottery/method-list', component: MethodListComponent, data: { keep: true } },
      { path: 'lottery/issue-list', component: IssueListComponent, data: { keep: true } },
      { path: 'lottery/issue-rule-list', component: IssueRuleListComponent, data: { keep: true } },
      { path: 'lottery/trace-list', component: TraceListComponent, data: { keep: true } },
      { path: 'lottery/project-list', component: ProjectListComponent, data: { keep: true } },
      { path: 'lottery/commission-list', component: CommissionListComponent, data: { keep: true } },

      // 真人视讯
      { path: 'casino/casino-platform-list', component: CasinoPlatformListComponent, data: { keep: true } },
      { path: 'casino/casino-method-list', component: CasinoMethodListComponent, data: { keep: true } },
      { path: 'casino/casino-category-list', component: CasinoCategoryListComponent, data: { keep: true } },
      { path: 'casino/casino-api-log-list', component: CasinoApiLogListComponent, data: { keep: true } },
      { path: 'casino/casino-transfer-log-list', component: CasinoTransferLogListComponent, data: { keep: true } },
      { path: 'casino/casino-bet-list', component: CasinoBetLogComponent, data: { keep: true } },

      // 玩家
      { path: 'player/player-list', component: PlayerListComponent, data: { keep: true } },
      { path: 'player/player-card-list', component: PlayerCardListComponent, data: { keep: true } },
      { path: 'player/salary-report-list', component: SalaryReportListComponent, data: { keep: true } },
      { path: 'player/dividend-report-list', component: DividendReportListComponent, data: { keep: true } },
      { path: 'player/playerVipConfig', component: PlayerVipConfigComponent, data: { keep: true } },
      { path: 'system/player-avatar-list', component: PlayerAvatarListComponent, data: { keep: true } },

      // 报表
      { path: 'report/lottery-day-list', component: ReportLotteryDayListComponent, data: { keep: true } },
      { path: 'report/stat-user-day-list', component: ReportStatUserDayComponent, data: { keep: true } },
      { path: 'report/stat-user-list', component: ReportStatUserListComponent, data: { keep: true } },
      { path: 'report/stat-user-day-list', component: ReportStatUserDayComponent, data: { keep: true } },
      { path: 'report/stat-user-list', component: ReportStatUserListComponent, data: { keep: true } },
      { path: 'report/account-change-report', component: AccountChangeListComponent, data: { keep: true } },
      { path: 'report/profit-and-loss-report', component: ProfitAndLossReportComponent, data: { keep: true } },

      // 日志管理
      { path: 'admin/admin-access-log', component: AccessLogComponent, data: { keep: true } },
      { path: 'admin/admin-behavior-log', component: BehaviorLogComponent, data: { keep: true } },
      { path: 'admin/player-access-log', component: AdminPlayerAccessLogComponent, data: { keep: true } },
      { path: 'admin/player-ip-log', component: AdminUserIpLogComponent, data: { keep: true } },

      // 帮助中心
      { path: 'system/helpMenu', component: HelpMenuComponent, data: { keep: true } },
      { path: 'system/helpMenuList', component: HelpMenuListComponent, data: { keep: true } },

      // 历史记录
      { path: 'backup/funcChange', component: BackupFuncChangeComponent, data: { keep: true } },
      { path: 'backup/partnerVisit', component: BackupPartnerVisitComponent, data: { keep: true } },
      { path: 'backup/issuesList', component: BackupIssuesListComponent, data: { keep: true } },
      { path: 'backup/partnerBehavior', component: BackupPartnerBehaviorComponent, data: { keep: true } },
      { path: 'backup/playerCommission', component: BackupPlayerCommissionComponent, data: { keep: true } },
      { path: 'backup/playerIp', component: BackupPlayerIpComponent, data: { keep: true } },
      { path: 'backup/playerProject', component: BackupPlayerProjectComponent, data: { keep: true } },
      { path: 'backup/playerTrace', component: BackupPlayerTraceComponent, data: { keep: true } },
      { path: 'backup/playerVisit', component: BackupPlayerVisitComponent, data: { keep: true } },
    ]
  },
  { path: 'login', component: LoginComponent, data: { animation: 'home' } },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
