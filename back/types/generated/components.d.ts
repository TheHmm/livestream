import type { Schema, Attribute } from '@strapi/strapi';

export interface EmojiEmoji extends Schema.Component {
  collectionName: 'components_emoji_emojis';
  info: {
    displayName: 'emoji';
    icon: 'angry';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    image: Attribute.Media;
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
