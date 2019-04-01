import { Service } from '../service';
import { Inject } from '../../util/injector';

// modules
import {
  ChatbotAlertsApiService,
  ChatbotCommandsApiService,
  ChatbotTimerApiService,
  ChatbotModToolsApiService,
  ChatbotQueueApiService,
  ChatbotQuotesApiService,
  ChatbotMediaRequestApiService,
  ChatbotBaseApiService,
  ChatbotCommonService,
  ChatbotLoyaltyApiService,
  ChatbotHeistApiService,
  ChatbotPollApiService,
  ChatbotBettingApiService,
  ChatbotImporterApiService,
} from './index';
import { ChatbotGambleApiService } from './chatbot-gamble';

export class ChatbotApiService extends Service {
  @Inject('ChatbotBaseApiService') Base: ChatbotBaseApiService;
  @Inject('ChatbotCommonService') Common: ChatbotCommonService;
  @Inject('ChatbotAlertsApiService') Alerts: ChatbotAlertsApiService;
  @Inject('ChatbotCommandsApiService') Commands: ChatbotCommandsApiService;
  @Inject('ChatbotTimerApiService') Timers: ChatbotTimerApiService;
  @Inject('ChatbotModToolsApiService') ModTools: ChatbotModToolsApiService;
  @Inject('ChatbotQueueApiService') Queue: ChatbotQueueApiService;
  @Inject('ChatbotQuotesApiService') Quotes: ChatbotQuotesApiService;
  @Inject('ChatbotMediaRequestApiService') MediaRequest: ChatbotMediaRequestApiService;
  @Inject('ChatbotLoyaltyApiService') Loyalty: ChatbotLoyaltyApiService;
  @Inject('ChatbotHeistApiService') Heist: ChatbotHeistApiService;
  @Inject('ChatbotPollApiService') Poll: ChatbotPollApiService;
  @Inject('ChatbotBettingApiService') Betting: ChatbotBettingApiService;
  @Inject('ChatbotImporterApiService') Importer: ChatbotImporterApiService;
  @Inject('ChatbotGambleApiService') Gamble: ChatbotGambleApiService;
}
