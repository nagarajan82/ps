import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import recentNews from "../../data/recentNews.json";

export function RecentNotesWidget() {
  console.log(recentNews);
  return (
    <div className="my-6">
      <h3 className="text-2xl p-2 font-bold uppercase">Recent News</h3>
      {recentNews.map((info) => (
        <div className="flex p-2" key={info.id}>
          <p className="w-32">{info.date}</p>
          <div className="flex-1 flex flex-wrap border-l-2 border-red-600 pl-4">
            <p className="font-bold">
              {info.header}
              <span className="font-normal pr-2">:</span>
            </p>
            <div className="">
              <a className="flex items-center" href={info.articleUrl}>
                <p className="font-light">{info.content}</p>
                <FontAwesomeIcon className="px-2" icon="up-right-from-square" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
