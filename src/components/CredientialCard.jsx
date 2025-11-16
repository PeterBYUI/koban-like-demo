export default function CredientialCard({ styling, children }) {
  let defaultStyling = "w-9/10 md:w-3/4 lg:w-2/3 mx-auto mt-16 bg-[#e6e6fa] shadow-[0_5px_10px_rgba(0,0,0,.3)] rounded-md mb-8 ";
  const finalStyling = defaultStyling + styling;

  return <div className={finalStyling}>{children}</div>;
}
