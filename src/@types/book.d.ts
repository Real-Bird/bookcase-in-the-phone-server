export type Book = {
  publisher: string;
  author: string;
  translator: string;
  title_url: string;
  ea_isbn: string;
  subject: string;
  title: string;
  publisher_predate: string;
  start_date: string;
  end_date: string;
  review: string;
};

export interface OpenSeojiData {
  docs: {
    PUBLISHER: string;
    AUTHOR: string;
    TITLE_URL: string;
    EA_ISBN: string;
    SUBJECT: string;
    TITLE: string;
    PUBLISH_PREDATE: string;
  }[];
}
