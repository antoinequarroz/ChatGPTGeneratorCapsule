import React, { useState } from "react";
import Title from "../components/Title";


const Home = () => {
  const [question, setQuestion] = useState("");
  const [time, setTime] = useState(1);
  const [sectionCount, setSectionCount] = useState(1);
  const [moduleCount, setModuleCount] = useState(1);
  const [language, setLanguage] = useState("français");
  const [chatGptResponse, setChatGptResponse] = useState("");


  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTime(parseInt(event.target.value));
  };

  const handleCapsuleCountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSectionCount(parseInt(event.target.value));
  };

  const handleModuleCountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setModuleCount(parseInt(event.target.value));
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await generateChatGPT(question, sectionCount, moduleCount, language, time);

    setChatGptResponse(response);
  };

  // Envoyer une requête à l'API d'OpenAI pour générer une réponse
  const generateChatGPT = async (
      question: string,
      capsuleCount: number,
      sectionCount: number,
      language: string,
      time: number
  ): Promise<string> => {
    const response = await fetch(
        'https://api.openai.com/v1/completions',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer ",
          },
          body: JSON.stringify({
            prompt: `Crée moi une formation de ${time} heures qui sera un texte pour une capsules vidéo de ${capsuleCount} modules de ${sectionCount} sections en ${language}. La thématique sera ${question}.Propose-moi une table des matière et scénario. Et par la suite créer moi pour chaque modules et sections de cette formation. Avec une introduction, un objectifs, un texte d'explication, une bibliographie et une conclusion pour chaque modules.`,
            model: 'text-davinci-003',
            max_tokens: 3048,
            n: 1,
            temperature: 0.7
          }),
        }
    );
    const data = await response.json();
    return data.choices[0]?.text?.trim();
  };
  // Afficher la réponse de l'API dans la console
  const handleDownload = () => {
    const content = chatGptResponse;
    const fileName = "chatGptResponse.txt";
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", fileName);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
      <div className="">
        <Title/>
        <div className="container mx-auto grid grid-cols-1 gap-6 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="my-4">
            <div className="my-4 pt-10">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="question">
                Question du thème
              </label>
              <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="question"
                  type="textarea"
                  placeholder="Question du thème"
                  value={question}
                  onChange={handleQuestionChange}
              />
            </div>

            <div className="my-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="time">
                Temps de la capsule
              </label>
              <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="time"
                  value={time}
                  onChange={handleTimeChange}
              >
                {Array.from({ length: 25 }, (_, i) => i + 1).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                ))}
              </select>
            </div>
            <div className="my-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="capsuleCount">
                Nombres de sections
              </label>
              <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="capsuleCount"
                  value={sectionCount}
                  onChange={handleCapsuleCountChange}
              >
                {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                ))}
              </select>
            </div>
            <div className="my-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="moduleCount">
                Nombres de modules
              </label>
              <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="moduleCount"
                  value={moduleCount}
                  onChange={handleModuleCountChange}
              >
                {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                ))}
              </select>
            </div>
            <div className="my-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="language">
                Langues
              </label>
              <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
              >
                <option value="français">
                  Français
                </option>
                <option value="allemand">
                  Allemand
                </option>
                <option value="anglais">
                  Anglais
                </option>
              </select>
            </div>

            <div className="my-5">
              <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
              >
                Envoyer
              </button>
            </div>
          </form>
          <form className="my-14">
            <div className="my-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="chatGptResponse">
                Réponse de Chat GPT
              </label>
              <textarea
                  className="shadow appearance-none border rounded w-full h-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="chatGptResponse"
                  value={chatGptResponse}
                  readOnly
              />
            </div>
            <div className="my-4">
              <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleDownload}>
                Télécharger le rendu de ChatGPT
              </button>
            </div>
          </form>
      </div>
      </div>
  );
};

export default Home;
