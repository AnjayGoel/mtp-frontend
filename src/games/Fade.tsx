import React, {useEffect, useState} from "react";


export interface FadeProps {
  show: boolean
  children: any
}

const Fade = ({show, children}: FadeProps) => {
  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };

  if (shouldRender) {
    return (
      <div
        style={{animation: `${show ? "fadeIn" : "fadeOut"} 2s`}}
        onAnimationEnd={onAnimationEnd}
      >
        {children}
      </div>
    )
  } else {
    return <div/>
  }
};

export default Fade;
