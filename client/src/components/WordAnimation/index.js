import Typewriter from "typewriter-effect";

export default function WordAnimation() {
    return(
        <Typewriter  
            options={
              {
                loop:true,
                delay:175, 
              }
            }
            onInit={ typewriter => {
              typewriter              
                .typeString("Secure")
                .pauseFor(1500)
                .deleteAll()
                .typeString("Fast")
                .pauseFor(1000)
                .deleteAll()
                .typeString("Easy to use")
                .start();
              }
            }
        />
    )
}