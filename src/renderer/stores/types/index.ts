interface User {}

interface LoginBgm {
  autoPlay: boolean;
}

interface LoginForm {
  id: string;
  password: string;
}

export interface Shortcut {
  id: string;
  name: string;
  description: string;
  defaultKey: string;
  currentKey: string;
}
