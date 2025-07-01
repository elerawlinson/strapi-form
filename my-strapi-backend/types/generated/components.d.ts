import type { Schema, Struct } from '@strapi/strapi';

export interface ElementsButton extends Struct.ComponentSchema {
  collectionName: 'components_elements_buttons';
  info: {
    displayName: 'Button';
  };
  attributes: {
    OpenInNewTab: Schema.Attribute.Boolean;
    Style: Schema.Attribute.Enumeration<['Selected ', 'Not Selected']>;
    Text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ElementsOptions extends Struct.ComponentSchema {
  collectionName: 'components_elements_options';
  info: {
    displayName: 'Options';
  };
  attributes: {
    Option: Schema.Attribute.Text;
  };
}

export interface PagesEndPage extends Struct.ComponentSchema {
  collectionName: 'components_pages_end_pages';
  info: {
    displayName: 'EndPage';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Headline: Schema.Attribute.String;
    Next: Schema.Attribute.Component<'elements.button', false>;
  };
}

export interface PagesHomePage extends Struct.ComponentSchema {
  collectionName: 'components_pages_home_pages';
  info: {
    displayName: 'HomePage';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Headline: Schema.Attribute.String;
    Logo: Schema.Attribute.Media<'images' | 'files'>;
    Next: Schema.Attribute.Component<'elements.button', false>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'elements.button': ElementsButton;
      'elements.options': ElementsOptions;
      'pages.end-page': PagesEndPage;
      'pages.home-page': PagesHomePage;
    }
  }
}
