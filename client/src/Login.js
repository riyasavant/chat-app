// package for text animation
import Typewriter from "typewriter-effect";

function login() {

    var typewriter = new Typewriter(null, {
      loop: true,
    });
  
    return (
      <div id="login">
        {/* app icon */}
        <svg  id="icon" width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-labelledby="title" aria-describedby="desc" role="img" xmlns="http://www.w3.org/1999/ xlink">
         <path d="M23.688 5.469h21.999l-11.084 20h13.084L22.094 58.531l6.053-23.062H16.313l7.375-30z" fill="#fb5454" data-name="layer2"></path>
         <path d="M34.603 25.469l11.084-20h-7.003l-11.083 20h7.002zm6.081 0L25.687 44.844l-3.593 13.687 25.593-33.062h-7.003z" opacity=".25" fill="#fb5454" data-name="layer1"></path>
         <path d="M23.688 5.469h21.999l-11.084 20h13.084L22.094 58.531l6.053-23.062H16.313l7.375-30z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="#fb5454" fill="#fb5454" data-name="stroke"></path>
        </svg>

        <div id="msg">
          <p id="desc">
            <Typewriter  
              options={{
              loop:true,
              delay:175, 
              }}
            onInit={(typewriter)=> {
            typewriter              
            .typeString("Secure")
            .pauseFor(1500)
            .deleteAll()
            .typeString("Fast")
            .pauseFor(1000)
            .deleteAll()
            .typeString("Easy to use")
            .start();
            }}/>
          </p> 
          <span id="messenger">Messenger</span> 
        </div>

        {/* User details */}
        <div id="credentials">  
          <form>
            <div id="usr-opt">
              <p id="new-user">New User? <span id="reg">Register</span></p>
            </div>
            <input type="text" placeholder="Username"/>
            <input type="text" placeholder="Password"/>
            <div>
              <p id="sign-in">Sign in </p>
              <svg className="arrow" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                <path fill="#fff" d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
              </svg>
            </div>
          </form>
        </div>

            {/* Page Design */}
          <svg id="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#fb5454" fillOpacity="1" d="M0,128L34.3,128C68.6,128,137,128,206,154.7C274.3,181,343,235,411,234.7C480,235,549,181,617,138.7C685.7,96,754,64,823,80C891.4,96,960,160,1029,176C1097.1,192,1166,160,1234,154.7C1302.9,149,1371,171,1406,181.3L1440,192L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z">
            </path>
          </svg> 

      </div>

    );
}

export default login;
