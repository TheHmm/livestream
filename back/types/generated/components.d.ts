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

export interface EmojiReaction extends Struct.ComponentSchema {
  collectionName: 'components_emoji_reactions';
  info: {
    displayName: 'Reaction';
  };
  attributes: {
    Emoji: Schema.Attribute.Component<'emoji.emoji', false>;
    sender: Schema.Attribute.Relation<'oneToOne', 'api::viewer.viewer'>;
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

export interface RentingOptionsRentingOption extends Struct.ComponentSchema {
  collectionName: 'components_renting_options_renting_options';
  info: {
    displayName: 'Renting Option';
    icon: 'connector';
  };
  attributes: {
    email_link: Schema.Attribute.RichText;
    is_add_on: Schema.Attribute.Boolean;
    long_description: Schema.Attribute.RichText;
    Name: Schema.Attribute.String;
    short_description: Schema.Attribute.Text;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'emoji.emoji': EmojiEmoji;
      'emoji.reaction': EmojiReaction;
      'phrases.phrase': PhrasesPhrase;
      'renting-options.renting-option': RentingOptionsRentingOption;
    }
  }
}
