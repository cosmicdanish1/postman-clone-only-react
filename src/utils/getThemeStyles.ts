export function getThemeStyles(theme: string) {
  const themeClass =
    theme === 'dark' ? 'theme-dark' : theme === 'black' ? 'theme-black' : '';

  const searchBarClass =
    theme === 'black'
      ? 'bg-black hover:bg-zinc-900'
      : theme === 'light'
      ? 'bg-white border border-gray-200 hover:bg-gray-100'
      : 'bg-neutral-800 hover:bg-neutral-900';

  const textLightClass =
    theme === 'light'
      ? 'text-gray-700 hover:text-black'
      : 'text-gray-500 hover:text-gray-100';

  const textClass =
    theme === 'light'
      ? 'text-black hover:text-gray-700'
      : 'text-white hover:text-gray-300'; // or gray-100 for softer dim

  const kbdClass =
    theme === 'light'
      ? 'bg-gray-200 text-gray-800 border border-gray-300'
      : 'bg-[#1f1f1f] text-gray-400 border border-white/10';

  const appNameClass = theme === 'light' ? 'text-black' : 'text-white';

  const borderClass =
    theme === 'black'
      ? 'border-b border-neutral-800'
      : theme === 'light'
      ? 'border-b border-gray-200'
      : 'border-b border-neutral-700';

  const buttonBgClass =
    theme === 'light' ? 'bg-[#F9FAFB]' : 'bg-[#1C1C1E]';

  return {
    themeClass,
    searchBarClass,
    textLightClass,
    textClass, // ✅ updated with proper hover behavior
    kbdClass,
    appNameClass,
    borderClass,
    buttonBgClass,
  };
}
