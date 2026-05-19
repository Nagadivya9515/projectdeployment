
import { useRef } from "react";
import { Link } from "react-router-dom";
import EventScrollCard from "../../components/packages/EventScrollCard";
import { ROUTES } from "../../constants/routes";
import { EVENT_SCROLL_CARDS } from "../../constants/eventTypes";


const HERO_IMAGE =
  "https://github.com/Nagadivya9515/EvenTrack/blob/main/event-frontend/src/assets/pic1.png?raw=true";


const Home = () => {
const scrollRef = useRef(null);

  const scroll = (direction) => {
  const amount = scrollRef.current.offsetWidth * 0.85;
  scrollRef.current.scrollBy({
    left: direction === "left" ? -amount : amount,
    behavior: "smooth"
  });
};

  return (
    <div>
    <section className="relative w-full h-screen bg-cover bg-center rounded-3xl overflow-hidden -mt-20" style={{ backgroundImage: `url(${HERO_IMAGE})` }} aria-label="Hero banner">
    {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4"  style={{ fontFamily: "Playfair Display" }}>
        <h5 className="text-3xl font-semibold mb-4">
           Where Every Moment Becomes a Masterpiece
        </h5>

        <p className="text-lg max-w-xl mb-6">
          Venora curates premium events with creativity, elegance, and
          unforgettable experiences.
        </p>
        <Link
          to={ROUTES.PACKAGES}
          className="bg-white text-black px-8 py-3 rounded font-medium hover:bg-gray-100 transition"
        >
          Explore Packages
        </Link>
      </div>
    </section>  

  {/* EVENT SECTION */}
      <section className="px-16 py-20 bg-white relative">

        <h2 className="text-4xl mb-10 font-semibold font-playfair">
          Our Event Services
        </h2>

        {/* Buttons */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg w-12 h-12 rounded-full"
        >
          ❮
        </button>

        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg w-12 h-12 rounded-full"
        >
          ❯
        </button>

        {/* VIEWPORT */}
        <div className="overflow-hidden">

          {/* SCROLL ROW */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth  no-scrollbar "
          >
            {EVENT_SCROLL_CARDS.map((event) => (
              <EventScrollCard 
              key={event.slug}
              title={event.title}
              content={event.content}
              image={event.image}
              slug={event.slug}
              />
            ))}
          </div>
        </div>
      </section>

     <section className="py-20 text-center bg-[#F9F8F6]">
      <h2 className="text-3xl font-semibold mb-3 font-playfair">
        Ready to Plan Your Event?
      </h2>

      <p className="text-gray-600 mb-8">
        Get started today and let us help you create unforgettable memories
      </p>

      <div className="flex justify-center gap-4">
        <Link
          to={ROUTES.PACKAGES}
          className="bg-white text-black px-8 py-3 rounded font-medium hover:bg-gray-100 transition"
          >
          Explore Packages
        </Link>

        <Link
            to={ROUTES.PRODUCTS}
            className="px-6 py-3 border rounded-md hover:bg-black hover:text-white transition"
            >
            Browse Products
        </Link>

        <Link
            to={ROUTES.CONTACT}
            className="px-6 py-3 border rounded-md hover:bg-black hover:text-white transition"
            >
            Contact Us
        </Link>
      </div>
      </section> 
  </div>
);
};

export default Home;
