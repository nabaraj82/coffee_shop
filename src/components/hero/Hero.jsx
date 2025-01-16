import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import BgImage from "../../assets/bg-slate.png";
import BlackCoffee from "../../assets/black.png";
import Navbar from "../navbar/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
const bgImage = {
  backgroundImage: `url(${BgImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  height: "100%",
  width: "100%",
};
const Hero = () => {
  const [sidebar, setSidebar] = useState(false);
  console.log("sidebar: ", sidebar);
  return (
    <main style={bgImage} className="min-h-screen">
      <section className="relative min-h-[750px] w-full">
        <div className="container">
          <Navbar sidebar={sidebar} setSidebar={setSidebar} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center min-h-[750px]">
            {/* first div section */}
            <div className="text-lightOrange mt-[100px] md:mt-0 p-4 space-y-28">
              <motion.h1
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 1.2,
                }}
                className="text-7xl font-bold leading-tight ml-14"
              >
                Blvck Tumbler
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 1.2,
                }}
                className="relative"
              >
                <div className="relative z-10 space-y-4">
                  <h1 className="text-2xl">Black Lifestyle Lovers,</h1>
                  <p className="text-sm opacity-55 leading-loose">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nemo, maiores enim eum, rerum obcaecati, quidem molestias
                    ipsa cum et suscipit earum omnis sunt ullam. Aperiam
                    aspernatur quos sed natus soluta?
                  </p>
                </div>
                <div className="absolute -top-6 -left-10 w-[250px] h-[190px] bg-gray-700/25"></div>
              </motion.div>
            </div>
            {/* second div section */}
            <div className="relative">
              <motion.img
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 0.4,
                }}
                src={BlackCoffee}
                className="relative z-40 h-[400px] md:h-[700px] img-shadow"
                alt="black coffee"
              />
              {/* orange ring circle */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 0.8,
                }}
                className="h-[180px] w-[180px] absolute top-24 -right-16 border-primary border-[20px] rounded-full z-10"
              />
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 0.8,
                }}
                className="absolute top-10 left-[200px] z-[1]"
              >
                <h1 className="text-[140px] scale-150 font-bold text-darkGray/50 leading-none">
                  Blvck Tumbler
                </h1>
              </motion.div>
            </div>
            {/* third section  */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: 1.2,
              }}
              className="text-lightOrange  p-4 space-y-28"
            >
              <h1 className="hidden md:block opacity-0 text-7xl font-bold leading-tight ml-14">
                Blvck Tumbler
              </h1>
              <div className="relative">
                <div className="relative z-10 space-y-4">
                  <h1 className="text-2xl">Black Tumbler</h1>
                  <p className="text-sm opacity-55 leading-loose">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nemo, maiores enim eum, rerum obcaecati, quidem molestias
                    ipsa cum et suscipit earum omnis sunt ullam. Aperiam
                    aspernatur quos sed natus soluta?
                  </p>
                </div>
                <div className="absolute -top-6 -right-10 w-[250px] h-[190px] bg-darkGray/50"></div>
              </div>
            </motion.div>
          </div>

        </div>
        {/* sidebar menu section */}
        <AnimatePresence>
          {sidebar && (
            <motion.div
              initial={{ x: "100%" }} // Sidebar starts off-screen to the right
              animate={{ x: 0 }} // Sidebar animates into view
              exit={{ x: "100%" }} // Sidebar exits off-screen to the left
              transition={{ duration: 0.5 }} // Transition duration for the animation
              className="absolute top-0 right-0 w-[140px] h-[20rem]  bg-gradient-to-b from-primary/80 to-primaryDark/80 backdrop-blur-sm "
            >
              <div className="w-full h-full flex justify-center items-center">
                <div className="flex flex-col justify-center items-center gap-6 w-full h-full">
                  {/* Line */}
                  <div className="w-[1px] h-[70px] bg-white"></div>

                  {/* Social Media Icons */}
                  <div className="inline-block p-2 rounded-full cursor-pointer border border-white">
                    <FaFacebookF className="text-2xl" />
                  </div>
                  <div className="inline-block p-2 rounded-full cursor-pointer border border-white">
                    <FaTwitter className="text-2xl" />
                  </div>
                  <div className="inline-block p-2 rounded-full border border-white">
                    <FaInstagram className="text-2xl" />
                  </div>

                  <div className="w-[1px] h-[70px] bg-white"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
};

export default Hero;
