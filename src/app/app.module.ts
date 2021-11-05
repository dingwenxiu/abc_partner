import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CronEditorModule } from 'cron-editor';
import { UEditorModule } from 'ngx-ueditor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { ColorPickerModule } from 'ngx-color-picker';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { RouteReuseStrategy } from '@angular/router';
import { AppReuseStrategy } from './app-reuse-strategy/app-reuse-strategy';
import { AppRoutingModule } from './router/app-routing.module';
import { AuthHttpInterceptor } from './api/auth-http.interceptor';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { ServiceService } from './service/service.service';
import { MyInterceptor } from './Interceptor/Interceptor';
import { HomeComponent } from './views/home/home.component';


// 管理模块
import { AdminUserListComponent } from './views/home/admin/admin-user-list/admin-user-list.component';
import { AdminGroupListComponent } from './views/home/admin/admin-group-list/admin-group-list.component';
import { DomainListComponent } from './views/home/admin/domain-list/domain-list.component';
import { MenuListComponent } from './views/home/admin/menu-list/menu-list.component';


// 运营管理
import { ConfigureComponent } from './views/home/system/configure/configure.component';
import { NoticeListComponent } from './views/home/system/notice-list/notice-list.component';
import { PushTaskListComponent } from './views/home/system/push-task-list/push-task-list.component';
import { ReviewListComponent } from './views/home/system/review-list/review-list.component';
import { ModuleListComponent } from './views/home/system/module-list/module-list.component';
import { LetterListComponent } from './views/home/system/letter-list/letter-list.component';
import { MerchantsConfigComponent } from './views/home/system/merchants-config/merchants-config.component';
import { CheckUserListComponent } from './views/home/system/check-user-list/check-user-list.component';

// 游戏模块
import { IssueListComponent } from './views/home/game/issue-list/issue-list.component';
import { LotteryListComponent } from './views/home/game/lottery-list/lottery-list.component';
import { IssueRuleListComponent } from './views/home/game/issue-rule-list/issue-rule-list.component';
import { MethodListComponent } from './views/home/game/method-list/method-list.component';
import { ProjectListComponent } from './views/home/game/project-list/project-list.component';
import { TraceListComponent } from './views/home/game/trace-list/trace-list.component';
import { CommissionListComponent } from './views/home/game/commission-list/commission-list.component';

// 活动
import { ActivityInfoComponent } from './views/home/activity/activity-info/activity-info.component';
import { ActivityPrizeComponent } from './views/home/activity/activity-prize/activity-prize.component';
import { ActivityRuleComponent } from './views/home/activity/activity-rule/activity-rule.component';
import { ActivityLogListComponent } from './views/home/activity/activity-log-list/activity-log-list.component';
// 玩家
import { PlayerListComponent } from './views/home/player/player-list/player-list.component';
import { PlayerCardListComponent } from './views/home/player/player-card-list/player-card-list.component';
import { SalaryReportListComponent } from './views/home/player/salary-report-list/salary-report-list.component';
import { DividendReportListComponent } from './views/home/player/dividend-report-list/dividend-report-list.component';
import { PlayerVipConfigComponent } from './views/home/player/player-vip-config/player-vip-config.component';
import { PlayerAvatarListComponent } from './views/home/player/player-avatar-list/player-avatar-list.component';
// 报表
import { ReportStatUserDayComponent } from './views/home/report/report-stat-user-day-list/report-stat-user-day.component';
import { ReportStatUserListComponent } from './views/home/report/report-stat-user-list/report-stat-user-list.component';
import { ReportLotteryDayListComponent} from './views/home/report/report-lottery-day-list/report-lottery-day-list.component';
import { AccountChangeListComponent } from './views/home/report/account-change-list/account-change-list.component';
import { ProfitAndLossReportComponent } from './views/home/report/profit-and-loss-report/profit-and-loss-report.component';

// 财务管理
import { FinanceRechargeListComponent } from './views/home/finance/finance-recharge-list/finance-recharge-list.component';
import { FinanceWithdrawListComponent } from './views/home/finance/finance-withdraw-list/finance-withdraw-list.component';
import { ChannelTypeComponent } from './views/home/finance/channel-type/channel-type.component';
import { PlatformComponent } from './views/home/finance/platform/platform.component';
import { PlatformAccountComponent } from './views/home/finance/platform-account/platform-account.component';
import { PlatformChannelComponent } from './views/home/finance/platform-channel/platform-channel.component';
import { PlatformAccountChannelComponent } from './views/home/finance/platform-account-channel/platform-account-channel.component';
import { WithdrawLogListComponent } from './views/home/finance/withdraw-log-list/withdraw-log-list.component';
import { RechargeLogListComponent } from './views/home/finance/recharge-log-list/recharge-log-list.component';
import { FinancewithdrawPassedListComponent } from './views/home/finance/withdraw-passed-list/withdraw-passed-list.component';
import { FinanceWithdrawFailListComponent } from './views/home/finance/withdraw-fail-list/withdraw-fail-list.component';
import { FinanceViewWithdrawListComponent } from './views/home/finance/view-withdraw-list/view-withdraw-list.component';
import { ViewWithdrawHandListComponent } from './views/home/finance/view-withdraw-hand-list/view-withdraw-hand-list.component';

// 娱乐城
import { CasinoPlatformListComponent } from './views/home/casino/platform-list/casino-platform-list.component';
import { CasinoCategoryListComponent } from './views/home/casino/category-list/casino-category-list.component';
import { CasinoMethodListComponent } from './views/home/casino/method-list/casino-method-list.component';
import { CasinoApiLogListComponent } from './views/home/casino/api-log-list/casino-api-log-list.component';
import { CasinoTransferLogListComponent } from './views/home/casino/transfer-log-list/casino-transfer-log-list.component';
import { CasinoBetLogComponent } from './views/home/casino/bet-Log/casino-bet-Log.component';

// 日志
import { AccessLogComponent } from './views/home/admin/access-log/access-log.component';
import { BehaviorLogComponent } from './views/home/admin/behavior-log/behavior-log.component';
import { AdminPlayerAccessLogComponent } from './views/home/admin/player-access-log/player-access-log.component';
import { AdminUserIpLogComponent } from './views/home/admin/player-ip-log/player-ip-log.component';

// 帮助中心
import { HelpMenuComponent } from './views/home/system/help-menu/help-menu.component';
import { HelpMenuListComponent } from './views/home/system/help-menu-list/help-menu-list.component';

// 历史数据
import { BackupFuncChangeComponent } from './views/home/backup/func-change/func-change.component';
import { BackupPartnerVisitComponent } from './views/home/backup/partner-visit/partner-visit.component';
import { BackupIssuesListComponent } from './views/home/backup/issues-list/issues-list.component';
import { BackupPartnerBehaviorComponent } from './views/home/backup/partner-behavior/partner-behavior.component';
import { BackupPlayerCommissionComponent } from './views/home/backup/player-commission/player-commission.component';
import { BackupPlayerIpComponent } from './views/home/backup/player-ip/player-ip.component';
import { BackupPlayerProjectComponent } from './views/home/backup/player-project/player-project.component';
import { BackupPlayerTraceComponent } from './views/home/backup/player-trace/player-trace.component';
import { BackupPlayerVisitComponent } from './views/home/backup/player-visit/player-visit.component';

// 管道
import { PipesModule } from './pipes/pipes.module';

// 自定义组件
import { HeadBreadcrumbComponent } from './components/head-breadcrumb/head-breadcrumb.component';
import { ContentPopDirective } from './directive/content-pop';

registerLocaleData(zh);

@NgModule({
  declarations: [
    ContentPopDirective,
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeadBreadcrumbComponent,
    // 财务管理
    FinanceRechargeListComponent,
    FinanceWithdrawListComponent,
    ChannelTypeComponent,
    PlatformComponent,
    PlatformAccountComponent,
    PlatformChannelComponent,
    PlatformAccountChannelComponent,
    WithdrawLogListComponent,
    RechargeLogListComponent,
    FinancewithdrawPassedListComponent,
    FinanceWithdrawFailListComponent,
    FinanceViewWithdrawListComponent,
    ViewWithdrawHandListComponent,

    // 运营管理
    ConfigureComponent,
    NoticeListComponent,
    PushTaskListComponent,
    ReviewListComponent,
    ModuleListComponent,
    LetterListComponent,
    CheckUserListComponent,

    // 管理
    AdminUserListComponent,
    AdminGroupListComponent,
    DomainListComponent,
    MenuListComponent,
    MerchantsConfigComponent,

    // 活动
    ActivityInfoComponent,
    ActivityPrizeComponent,
    ActivityRuleComponent,
    ActivityLogListComponent,

    // 游戏
    LotteryListComponent,
    IssueListComponent,
    IssueRuleListComponent,
    MethodListComponent,
    ProjectListComponent,
    TraceListComponent,
    CommissionListComponent,

    // 玩家
    PlayerListComponent,
    PlayerCardListComponent,
    SalaryReportListComponent,
    DividendReportListComponent,
    PlayerVipConfigComponent,
    PlayerAvatarListComponent,

    // 报表
    ReportLotteryDayListComponent,
    ReportStatUserDayComponent,
    ReportStatUserListComponent,
    AccountChangeListComponent,
    ProfitAndLossReportComponent,

    // 娱乐城
    CasinoPlatformListComponent,
    CasinoCategoryListComponent,
    CasinoMethodListComponent,
    CasinoApiLogListComponent,
    CasinoTransferLogListComponent,
    CasinoBetLogComponent,

    // 日志
    AccessLogComponent,
    BehaviorLogComponent,
    AdminPlayerAccessLogComponent,
    AdminUserIpLogComponent,

    // 帮助中心
    HelpMenuComponent,
    HelpMenuListComponent,

    // 历史数据
    BackupFuncChangeComponent,
    BackupPartnerVisitComponent,
    BackupIssuesListComponent,
    BackupPartnerBehaviorComponent,
    BackupPlayerCommissionComponent,
    BackupPlayerIpComponent,
    BackupPlayerProjectComponent,
    BackupPlayerTraceComponent,
    BackupPlayerVisitComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    PipesModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    CronEditorModule,
    NzCascaderModule,
    UEditorModule.forRoot({
      js: [
        `../../../assets/ueditor/ueditor.config.js`,
        `../../../assets/ueditor/ueditor.all.js`,
      ],
      // 默认前端配置项
      options: {
        UEDITOR_HOME_URL: '/assets/ueditor/',
        // serverUrl:'http://api.9170ttt.com/api/content/upload-pic'//不配置该参数，代码动态获取
      }
    }),
    ColorPickerModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: RouteReuseStrategy, useClass: AppReuseStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
    ServiceService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
