import { getAuth } from "firebase/auth";
import { useRef} from "react";
import Footer from "./Footer";


function About() {
       const user= useRef(getAuth().currentUser)
       return (
              <div>
                  <h2 id="about-header">Who are we ?</h2>   
              <div id="about">
                     <img src='images/about.jpg'></img>
                     <p>
                            In that ethos, we’ve opened My Food locations all across New York and Los Angeles-–with more to come.
                            We are known for our chicken and waffles, we add new versions all the time, but our menu also goes way beyond that! Other popular dishes include our signature buttermilk biscuit breakfast sandwiches, crispy chicken sandwiches, fresh market salads, and our signature maple lemonades.
                     </p>
                    
              </div>
              {!user.current?<Footer></Footer>:<></>}
              </div>
       )

}

export default About;