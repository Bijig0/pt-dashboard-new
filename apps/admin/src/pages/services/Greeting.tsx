interface Props {
  name: string;
}

export default function Greeting({ name }: Props) {
  return <h1>Hello {name}!</h1>;
}
