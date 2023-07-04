import { Player } from '@lottiefiles/react-lottie-player';

export default function Icon(props: { width: string; height: string }) {
  return (
    <Player
      src="https://assets6.lottiefiles.com/packages/lf20_iilq3soe.json"
      background="transparent"
      speed={1}
      style={{ ...props }}
      loop
      controls
      autoplay
    />
  );
}
