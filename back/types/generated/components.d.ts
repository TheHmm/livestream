import type { Attribute, Schema } from '@strapi/strapi';

export interface EmojiEmoji extends Schema.Component {
  collectionName: 'components_emoji_emojis';
  info: {
    description: '';
    displayName: 'emoji';
    icon: 'angry';
  };
  attributes: {
    image: Attribute.Media<'images'>;
    name: Attribute.String & Attribute.Required;
  };
}

export interface PhrasesPhrase extends Schema.Component {
  collectionName: 'components_phrases_phrases';
  info: {
    displayName: 'phrase';
    icon: 'microphone';
  };
  attributes: {
    phrase: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'emoji.emoji': EmojiEmoji;
      'phrases.phrase': PhrasesPhrase;
    }
  }
}
