export default function Header() {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl lg:text-5xl font-extrabold text-center mb-6">
        <span className="block text-sky-600 dark:text-sky-400">AI PM</span>
        Revolutionize Your Project Management with AI
      </h1>
      <p className="text-lg lg:text-xl mx-auto max-w-3xl text-center mb-8 leading-relaxed">
        Welcome to <span className="font-bold text-sky-600 dark:text-sky-400">AI PM</span> — your ultimate AI-powered project management solution. Our platform combines cutting-edge artificial intelligence with a user-friendly interface to streamline project planning, enhance team collaboration, and optimize task management. 
        Experience the future of project management and keep your projects on track with ease.
      </p>
      <div className="w-full p-1 bg-sky-600 dark:bg-sky-400 my-8 rounded-full shadow-lg" />
    </div>
  );
}
