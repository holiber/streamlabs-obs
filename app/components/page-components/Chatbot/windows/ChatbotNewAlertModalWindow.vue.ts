import cloneDeep from 'lodash/cloneDeep';
import { Component, Prop, Watch } from 'vue-property-decorator';
import ChatbotAlertsBase from 'components/page-components/Chatbot/module-bases/ChatbotAlertsBase.vue';
import { TextInput, TextAreaInput, ListInput, NumberInput } from 'components/shared/inputs/inputs';
import { $t } from 'services/i18n';
import ValidatedForm from 'components/shared/inputs/ValidatedForm.vue';
import {
  EInputType,
  IListMetadata,
  INumberMetadata,
  ITextMetadata,
} from 'components/shared/inputs/index';

import { IAlertMessage, NEW_ALERT_MODAL_ID, ChatbotAlertType } from 'services/chatbot';
import { debounce } from 'lodash-decorators';

interface INewAlertMetadata {
  follow: {
    newMessage: {
      message: ITextMetadata;
    };
  };
  sub: {
    newMessage: {
      tier: IListMetadata<string>;
      amount: INumberMetadata;
      message: ITextMetadata;
      is_gifted: IListMetadata<boolean>;
    };
  };
  tip: {
    newMessage: {
      amount: INumberMetadata;
      message: ITextMetadata;
    };
  };
  host: {
    newMessage: {
      amount: INumberMetadata;
      message: ITextMetadata;
    };
  };
  raid: {
    newMessage: {
      amount: INumberMetadata;
      message: ITextMetadata;
    };
  };
  bits: {
    newMessage: {
      amount: INumberMetadata;
      message: ITextMetadata;
    };
  };
  sub_mystery_gift: {
    newMessage: {
      tier: IListMetadata<string>;
      amount: INumberMetadata;
      message: ITextMetadata;
    };
  };
  superchat: {
    newMessage: {
      amount: INumberMetadata;
      message: ITextMetadata;
    };
  };
  sponsor: {
    newMessage: {
      amount: INumberMetadata;
      message: ITextMetadata;
    };
  };
}

interface INewAlertData {
  [id: string]: {
    newMessage: IAlertMessage;
  };
  follow: {
    newMessage: IAlertMessage;
  };
  sub: {
    newMessage: IAlertMessage;
  };
  tip: {
    newMessage: IAlertMessage;
  };
  host: {
    newMessage: IAlertMessage;
  };
  raid: {
    newMessage: IAlertMessage;
  };
  bits: {
    newMessage: IAlertMessage;
  };
  sub_mystery_gift: {
    newMessage: IAlertMessage;
  };
  sponsor: {
    newMessage: IAlertMessage;
  };
  superchat: {
    newMessage: IAlertMessage;
  };
}

@Component({
  components: {
    TextInput,
    TextAreaInput,
    ListInput,
    NumberInput,
    ValidatedForm,
  },
})
export default class ChatbotNewAlertModalWindow extends ChatbotAlertsBase {
  @Prop()
  selectedType: ChatbotAlertType;

  $refs: {
    form: ValidatedForm;
  };

  onSubmitHandler: Function = () => {};

  newAlert: INewAlertData = cloneDeep(this.initialNewAlertState);

  isEdit = false;

  get NEW_ALERT_MODAL_ID() {
    return NEW_ALERT_MODAL_ID;
  }

  get title() {
    if (this.selectedType === 'sponsor') {
      return `${this.isEdit ? 'Edit' : 'New'} Member Alert`;
    }
    return `${this.isEdit ? 'Edit' : 'New'} ${this.selectedType} Alert`;
  }

  get isDonation() {
    return this.selectedType === 'tip';
  }

  get isSubscription() {
    return this.selectedType === 'sub';
  }

  get isTwitch() {
    return this.chatbotApiService.Base.userService.platform.type === 'twitch';
  }

  get isYoutube() {
    return this.chatbotApiService.Base.userService.platform.type === 'youtube';
  }

  get isFollower() {
    return this.selectedType === 'follow';
  }

  get isHost() {
    return this.selectedType === 'host';
  }

  get isRaid() {
    return this.selectedType === 'raid';
  }

  get isSponsor() {
    return this.selectedType === 'sponsor';
  }

  get isSuperChat() {
    return this.selectedType === 'superchat';
  }

  get isBit() {
    return this.selectedType === 'bits';
  }

  get isSubMysteryGift() {
    return this.selectedType === 'sub_mystery_gift';
  }

  get disabledSubmit() {
    const { message, tier, amount } = this.newAlert[this.selectedType].newMessage;
    if (this.isFollower) return !message;
    if (this.isSubscription) return !amount || !message || !tier;

    return amount === null || !message;
  }

  get metadata(): INewAlertMetadata {
    return {
      follow: {
        newMessage: {
          message: {
            type: EInputType.text,
            required: true,
            placeholder: $t('Message to follower'),
          },
        },
      },
      sub: {
        newMessage: {
          tier: {
            required: true,
            type: EInputType.list,
            options: ['Prime', 'Tier 1', 'Tier 2', 'Tier 3'].map(tier => ({
              value: tier,
              title: $t(tier),
            })),
          },
          amount: {
            required: true,
            type: EInputType.number,
            placeholder: $t('Number of months subscribed'),
            max: Number.MAX_SAFE_INTEGER,
          },
          message: {
            type: EInputType.textArea,
            required: true,
            placeholder: $t('Message to subscriber'),
            max: 450,
          },
          is_gifted: {
            required: true,
            type: EInputType.list,
            options: ['yes', 'no'].map(isGifted => ({
              value: isGifted === 'yes',
              title: $t(isGifted),
            })),
          },
        },
      },
      tip: {
        newMessage: {
          amount: {
            type: EInputType.number,
            min: 0,
            required: true,
            placeholder: $t('Minimum amount'),
            max: Number.MAX_SAFE_INTEGER,
          },
          message: {
            type: EInputType.textArea,
            required: true,
            placeholder: $t('Message to donator'),
            max: 450,
          },
        },
      },
      host: {
        newMessage: {
          amount: {
            required: true,
            type: EInputType.number,
            min: 0,
            placeholder: $t('Minimum viewer count'),
            max: Number.MAX_SAFE_INTEGER,
          },
          message: {
            type: EInputType.textArea,
            required: true,
            placeholder: $t('Message to hosts'),
            max: 450,
          },
        },
      },
      raid: {
        newMessage: {
          amount: {
            min: 0,
            type: EInputType.number,
            required: true,
            placeholder: $t('Minimum amount'),
            max: Number.MAX_SAFE_INTEGER,
          },
          message: {
            required: true,
            type: EInputType.textArea,
            placeholder: $t('Message to raider'),
            max: 450,
          },
        },
      },
      bits: {
        newMessage: {
          amount: {
            required: true,
            type: EInputType.number,
            min: 0,
            placeholder: $t('Minimum bit count'),
            max: Number.MAX_SAFE_INTEGER,
          },
          message: {
            required: true,
            type: EInputType.textArea,
            placeholder: $t('Message to Bit donators'),
            max: 450,
          },
        },
      },
      sub_mystery_gift: {
        newMessage: {
          tier: {
            required: true,
            type: EInputType.list,
            options: ['Prime', 'Tier 1', 'Tier 2', 'Tier 3'].map(tier => ({
              value: tier,
              title: $t(tier),
            })),
          },
          amount: {
            required: true,
            type: EInputType.number,
            placeholder: $t('Number of months subscribed'),
            max: Number.MAX_SAFE_INTEGER,
          },
          message: {
            type: EInputType.textArea,
            required: true,
            placeholder: $t('Message to subscriber'),
            max: 450,
          },
        },
      },
      superchat: {
        newMessage: {
          amount: {
            required: true,
            type: EInputType.number,
            placeholder: $t('Minimum Amount'),
            max: Number.MAX_SAFE_INTEGER,
          },
          message: {
            type: EInputType.textArea,
            required: true,
            placeholder: $t('Message to Super Chatter'),
            max: 450,
          },
        },
      },
      sponsor: {
        newMessage: {
          amount: {
            required: true,
            type: EInputType.number,
            placeholder: $t('Minimum Amount'),
            max: Number.MAX_SAFE_INTEGER,
          },
          message: {
            type: EInputType.textArea,
            required: true,
            placeholder: $t('Message to Member'),
            max: 450,
          },
        },
      },
    };
  }

  get initialNewAlertState(): INewAlertData {
    return {
      follow: {
        newMessage: {
          message: null,
        },
      },
      sub: {
        newMessage: {
          amount: null,
          message: null,
          is_gifted: false,
          tier: $t('Prime'),
        },
      },
      tip: {
        newMessage: {
          amount: null,
          message: null,
        },
      },
      host: {
        newMessage: {
          amount: null,
          message: null,
        },
      },
      raid: {
        newMessage: {
          amount: null,
          message: null,
        },
      },
      bits: {
        newMessage: {
          amount: null,
          message: null,
        },
      },
      sub_mystery_gift: {
        newMessage: {
          amount: null,
          message: null,
          tier: $t('Prime'),
        },
      },
      sponsor: {
        newMessage: {
          amount: null,
          message: null,
        },
      },
      superchat: {
        newMessage: {
          amount: null,
          message: null,
        },
      },
    };
  }

  bindOnSubmitAndCheckIfEdited(event: any) {
    const { onSubmitHandler, editedAlert } = event.params;
    this.onSubmitHandler = onSubmitHandler;
    if (editedAlert) {
      this.isEdit = true;
      this.newAlert[this.selectedType].newMessage = cloneDeep(editedAlert);
    } else {
      this.isEdit = false;
      this.newAlert = cloneDeep(this.initialNewAlertState);
    }
  }

  onCancelHandler() {
    this.$modal.hide(NEW_ALERT_MODAL_ID);
  }

  @Watch('errors.items.length')
  @debounce(200)
  async onErrorsChanged() {
    await this.$refs.form.validateAndGetErrorsCount();
  }

  async onSubmit() {
    if (await this.$refs.form.validateAndGetErrorsCount()) return;
    this.onSubmitHandler(this.newAlert[this.selectedType].newMessage);
  }
}
