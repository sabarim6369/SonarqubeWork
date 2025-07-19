import React from "react";
import { useSelector } from "react-redux";
import { GoSearch } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const images = import.meta.glob('/src/assets/public/*', { eager: true });

export default function Coding() {
  const student = useSelector((state) => state.student);
  const coding = useSelector((state) => state.coding);
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();

  // const filteredCoding = coding.filter(item =>
  //   item.name.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <div className="h-full w-full p-8 pt-10">
      <div className="flex flex-row justify-between items-center mb-4">
        <div className="text-2xl font-semibold text-blue">
          Coding
        </div>
        <div className="w-120 h-13 bg-gray-100 rounded-xl flex flex-row items-center gap-4 px-4">
          <GoSearch color="#555555" className="h-5 w-5" />
          <input
            type="text"
            placeholder="Search"
            className="w-full h-full bg-transparent outline-none text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full overflow-y-auto " style={{ height: "calc(100vh - 136px)" }}>
        {
          coding.map((codingItem, index) => {
            console.log(codingItem);
            return (
              <div
                key={index}
                className="h-15 w-full bg-gray-100 hover:bg-gray-200 rounded-xl flex flex-row items-center justify-between pl-4 pr-4 mb-4 cursor-pointer"
                onClick={() => {
                  codingItem.type === "manual" ? navigate(`/coding/${codingItem._id}`) : window.open(codingItem.link, "_blank");
                }}
              >
                <div className="flex flex-row items-center gap-4">
                  <div className={`h-5 w-5 rounded-full items-center justify-center bg-green-300`}>
                    
                  </div>
                  <div className="font-medium">
                    {codingItem.problemName}
                  </div>
                </div>
                <div className="">
                  {
                    codingItem.difficulty === "easy" ? (
                      <div className="bg-lime-300 text-lime-700 font-medium w-25 text-sm py-1.5 flex items-center justify-center rounded-full ">
                        Easy
                      </div>
                    ) : codingItem.difficulty === "medium" ? (
                      <div className="bg-yellow-300 text-yellow-700 font-medium w-25 text-sm py-1.5 flex items-center justify-center rounded-full">
                        Medium
                      </div>
                    ) : (
                      <div className="bg-red-300 text-red-700 font-medium w-25 text-sm py-1.5 flex items-center justify-center rounded-full">
                        Hard
                      </div>
                    )
                  }
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}
