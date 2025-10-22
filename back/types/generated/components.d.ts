import type { Schema, Struct } from '@strapi/strapi';

export interface EmojiEmoji extends Struct.ComponentSchema {
  collectionName: 'components_emoji_emojis';
  info: {
    description: '';
    displayName: 'emoji';
    icon: 'angry';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PhrasesPhrase extends Struct.ComponentSchema {
  collectionName: 'components_phrases_phrases';
  info: {
    displayName: 'phrase';
    icon: 'microphone';
  };
  attributes: {
    phrase: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'emoji.emoji': EmojiEmoji;
      'phrases.phrase': PhrasesPhrase;
    }
  }
}
