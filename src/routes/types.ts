
export type Model = {
  model: string;
  company: string;
};

export type Message = {
  user: string | 'AI';
  time: string;
  content: string;
};