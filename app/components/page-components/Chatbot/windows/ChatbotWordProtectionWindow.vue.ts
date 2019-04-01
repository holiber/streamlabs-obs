import { Component, Watch } from 'vue-property-decorator';
import ChatbotModToolsBase from 'components/page-components/Chatbot/module-bases/ChatbotModToolsBase.vue';
import { $t } from 'services/i18n';
import ChatbotWordProtectionList from 'components/page-components/Chatbot/windows/ChatbotWordProtectionList.vue';
import { ITab } from 'components/Tabs.vue';
import ValidatedForm from 'components/shared/inputs/ValidatedForm.vue';
import { debounce } from 'lodash-decorators';

@Component({
  components: {
    ChatbotWordProtectionList,
    ValidatedForm,
  },
})
export default class ChatbotWordProtectionWindow extends ChatbotModToolsBase {
  $refs: {
    form: ValidatedForm;
  };

  tabs: ITab[] = [
    {
      name: $t('General'),
      value: 'general',
    },
    {
      name: $t('Blacklist'),
      value: 'blacklist',
    },
  ];

  selectedTab: string = 'general';

  async onSelectTabHandler(tab: string) {
    if (tab === 'blacklist') {
      // moving to blacklist
      // validate form first
      if (await this.$refs.form.validateAndGetErrorsCount()) return;
    }
    this.selectedTab = tab;
  }

  onResetHandler() {
    this.onResetSlugHandler('words-protection');
  }

  @Watch('errors.items.length')
  @debounce(200)
  async onErrorsChanged() {
    await this.$refs.form.validateAndGetErrorsCount();
  }

  async onSaveHandler() {
    if (this.$refs.form && (await this.$refs.form.validateAndGetErrorsCount())) return;

    this.chatbotApiService.ModTools.updateWordProtection({
      enabled: this.wordProtectionResponse.enabled,
      settings: this.wordProtection,
    }).then(() => {
      this.chatbotApiService.Common.closeChildWindow();
    });
  }
}
