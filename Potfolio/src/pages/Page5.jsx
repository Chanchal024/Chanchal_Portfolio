import React, { useState } from 'react';

/**
 * Page5 — Contact Section
 * Premium contact form with glassmorphism and Tailwind utility classes.
 */
const Page5 = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    fetch("https://formsubmit.co/ajax/mandalchanchal243@gmail.com", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      setIsSubmitting(false);
      alert('Message sent successfully!');
      e.target.reset();
    })
    .catch(error => {
      setIsSubmitting(false);
      alert('Error sending message.');
    });
  };

  return (
    <div id="contact" className="relative z-10 w-full min-h-[100dvh] flex flex-col items-center justify-start p-4 sm:p-6 md:p-10 lg:p-16 xl:p-24 2xl:pt-48 overflow-hidden bg-transparent">

      {/* ── Section Header (Naturally flowing vertical layout) ── */}
      <div className="text-center lg:text-left mb-12 md:mb-16 2xl:mb-32 w-full max-w-6xl 2xl:max-w-full mt-12 lg:mt-16 pointer-events-none 2xl:translate-x-12">
        <h2 className="font-['OriginTech'] font-extrabold text-[clamp(2.5rem,6vw,5rem)] lg:text-[clamp(2.5rem,6vw,5.5rem)] 2xl:text-[8rem] text-[var(--heading-color)] m-0 tracking-tight leading-[1.1] bg-gradient-to-br from-[var(--heading-color)] to-[var(--heading-color)]/50 bg-clip-text text-transparent pointer-events-auto cursor-hover-text">
          Let's Connect
          <br />
          <span className="font-['Universa'] font-normal text-[clamp(1rem,1.8vw,1.4rem)] 2xl:text-3xl 2xl:mt-4 text-[var(--text-color)]/70 tracking-wide block -mt-2">Have a project in mind? Let's talk.</span>
        </h2>
      </div>

      {/* ── Contact Layout (Grid) ── */}
      <div className="w-full max-w-6xl 2xl:max-w-[100rem] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 2xl:gap-16 items-start">

        {/* Left: Info & Socials */}
        <div className="flex flex-col gap-8 2xl:gap-12 order-2 lg:order-1 text-center lg:text-left">
          <div>
            <h3 className="text-xl md:text-3xl 2xl:text-5xl font-bold font-['OriginTech'] text-[var(--heading-color)] mb-3 2xl:mb-6">
              Drop me a line
            </h3>
            <p className="text-sm md:text-base 2xl:text-xl text-[var(--text-color)]/60 max-w-md lg:max-w-xl 2xl:max-w-3xl mx-auto lg:mx-0 leading-relaxed 2xl:leading-relaxed font-['Universa']">
              I'm always open to discussing web development projects, creative ideas, or opportunities to be part of your visions.
            </p>
          </div>

          <div className="flex flex-col gap-4 2xl:gap-6">
            <a href="mailto:mandalchanchal243@gmail.com" className="group flex items-center justify-center lg:justify-start gap-4 2xl:gap-6 text-[var(--text-color)]/80 hover:text-[var(--text-color)] transition-colors">
              <div className="w-12 h-12 2xl:w-16 2xl:h-16 rounded-full border border-[var(--text-color)]/10 bg-[var(--text-color)]/5 flex items-center justify-center group-hover:bg-[var(--text-color)]/10 transition-colors">
                <i className="ri-mail-line text-xl 2xl:text-2xl"></i>
              </div>
              <span className="font-['Universa'] font-medium text-sm md:text-base 2xl:text-xl tracking-wide">mandalchanchal243@gmail.com</span>
            </a>


          </div>

          <div className="flex items-center justify-center lg:justify-start gap-4 2xl:gap-6 mt-4 2xl:mt-8">
            {[
              { icon: 'ri-github-fill', link: 'https://github.com/Chanchal024' },
              { icon: 'ri-linkedin-fill', link: 'https://www.linkedin.com/in/mandal-chanchal' },
              { icon: 'ri-dribbble-line', link: '#' }
            ].map((social, i) => (
              <a key={i} href={social.link} target={social.link !== '#' ? "_blank" : "_self"} rel={social.link !== '#' ? "noopener noreferrer" : ""} className="w-10 h-10 2xl:w-16 2xl:h-16 rounded-full bg-[var(--text-color)]/5 border border-[var(--text-color)]/10 flex items-center justify-center text-[var(--text-color)]/70 hover:text-[var(--text-color)] hover:bg-[var(--text-color)]/20 hover:scale-110 transition-all duration-300">
                <i className={`${social.icon} text-lg 2xl:text-2xl`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Right: Glassmorphism Form */}
        <div className="order-1 lg:order-2 w-full max-w-md lg:max-w-2xl 2xl:max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-[var(--text-color)]/[0.03] backdrop-blur-xl border border-[var(--text-color)]/10 p-5 sm:p-7 md:p-8 2xl:p-12 rounded-3xl 2xl:rounded-[2.5rem] shadow-2xl flex flex-col gap-4 sm:gap-5 2xl:gap-8"
          >
            <div className="flex flex-col gap-1.5 2xl:gap-2">
              <label className="text-xs 2xl:text-lg font-['Universa'] font-semibold text-[var(--text-color)]/50 uppercase tracking-wider pl-2 2xl:pl-3">Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                className="w-full bg-[var(--bg-color)]/40 border border-[var(--text-color)]/10 rounded-xl 2xl:rounded-2xl px-4 2xl:px-6 py-3.5 2xl:py-5 text-[var(--text-color)] font-['Universa'] text-sm 2xl:text-xl focus:outline-none focus:border-[var(--text-color)]/30 focus:bg-[var(--text-color)]/5 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5 2xl:gap-2">
              <label className="text-xs 2xl:text-lg font-['Universa'] font-semibold text-[var(--text-color)]/50 uppercase tracking-wider pl-2 2xl:pl-3">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                className="w-full bg-[var(--bg-color)]/40 border border-[var(--text-color)]/10 rounded-xl 2xl:rounded-2xl px-4 2xl:px-6 py-3.5 2xl:py-5 text-[var(--text-color)] font-['Universa'] text-sm 2xl:text-xl focus:outline-none focus:border-[var(--text-color)]/30 focus:bg-[var(--text-color)]/5 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5 2xl:gap-2">
              <label className="text-xs 2xl:text-lg font-['Universa'] font-semibold text-[var(--text-color)]/50 uppercase tracking-wider pl-2 2xl:pl-3">Message</label>
              <textarea
                name="message"
                required
                placeholder="How can I help you?"
                rows="4"
                className="w-full bg-[var(--bg-color)]/40 border border-[var(--text-color)]/10 rounded-xl 2xl:rounded-2xl px-4 2xl:px-6 py-3.5 2xl:py-5 text-[var(--text-color)] font-['Universa'] text-sm 2xl:text-xl focus:outline-none focus:border-[var(--text-color)]/30 focus:bg-[var(--text-color)]/5 transition-all resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 2xl:mt-6 w-full bg-[var(--heading-color)] text-[var(--bg-color)] font-['Universa'] font-bold py-3.5 2xl:py-5 text-base 2xl:text-xl rounded-xl 2xl:rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px] 2xl:min-h-[64px]"
            >
              {isSubmitting ? 'Sending...' : (
                <>
                  Send Message
                  <i className="ri-send-plane-fill"></i>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Page5;
