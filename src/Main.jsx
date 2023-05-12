import './Main.css'
import {AppContext} from './App.jsx'
import { useContext } from 'react'

function Main() {

  const chapterContext = useContext(AppContext)

  function nextChapter() {
    if (chapterContext.chapter >= chapterContext.maxChapter) return
    chapterContext.setChapter((chapter) => chapter + 1)
    if (chapterContext.chapter > chapterContext.finishedChapter) {
      chapterContext.setFinishedChapter(chapterContext.chapter)
    }
  }

  function prevChapter() {
    if (chapterContext.chapter <= 1) return
    chapterContext.setChapter((chapter) => chapter - 1)
  }

  return (
    <main>
      <div className="chapter">
      <h2>Chapter {chapterContext.chapter}</h2>
      <section>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum dolor officiis minus unde nemo tempore molestias, maxime commodi, ea quod, ullam iste laborum error beatae eos autem maiores. Iure eius porro possimus impedit. Dicta quae necessitatibus, nobis aspernatur provident qui excepturi similique commodi, impedit ad tempora consectetur quasi perferendis repellendus ipsum voluptatum ullam iusto? Commodi eius sunt esse ex tenetur molestiae quaerat, cumque reprehenderit officia ipsum ratione assumenda tempore dolorum omnis sit eaque dolor? Eos amet ex voluptate dolorem, quaerat nihil alias enim exercitationem ab aperiam odio iste totam. Expedita vero excepturi ipsa reiciendis architecto deserunt magni aperiam in, nostrum, temporibus neque accusamus at ullam delectus impedit aliquid maxime beatae officia provident repellendus ratione suscipit rerum dolore animi? Animi ex tempora rem id quis mollitia architecto, ab, similique vero iure omnis. Odit quisquam vero quas sed, commodi vel nam adipisci excepturi quod magni, soluta facilis laborum harum ipsam quasi sint mollitia et nisi. Reiciendis aliquam libero necessitatibus. Ab, sunt cum obcaecati incidunt facere saepe deserunt accusantium ut similique enim error distinctio dignissimos quasi magnam inventore qui voluptatibus velit quis quos est laboriosam. Illo culpa temporibus architecto facere labore aut molestias maxime recusandae consectetur distinctio saepe, possimus odit quod id nobis voluptatum minima iste incidunt cum quibusdam totam impedit expedita! Delectus est veritatis, pariatur iure aut nesciunt ea, doloremque sint suscipit, eligendi magni voluptatibus debitis totam excepturi necessitatibus asperiores ipsum ducimus quam. Corrupti harum eum corporis veniam inventore delectus natus accusantium! Sunt modi dignissimos vero ipsam neque laudantium eligendi quas veritatis illum, eum officiis beatae velit soluta laboriosam maxime perspiciatis expedita voluptatum id. Consequatur mollitia, sit beatae quaerat iste odit delectus quidem iusto incidunt natus asperiores neque a magni tempora ratione earum, blanditiis commodi iure! Recusandae eligendi ipsum, ab minus eveniet officiis deleniti eum dolores fuga itaque quis placeat rem soluta natus laboriosam quibusdam beatae nisi esse velit repudiandae laborum praesentium? Ut iste neque quam modi minus illum quod earum beatae perspiciatis officia itaque saepe a possimus officiis aperiam voluptatem dolore cupiditate, distinctio facere? Soluta, nulla dignissimos? Ad libero veniam, aperiam debitis odio alias maxime. Maiores iure iste quos deserunt unde incidunt odio commodi veniam, accusamus vitae facilis obcaecati culpa delectus atque necessitatibus minima iusto quo quidem eveniet soluta adipisci rerum aut. Tempora neque expedita nulla fuga ratione maxime corporis praesentium quibusdam totam, nobis deleniti? Voluptatum dolorem quod dolores doloremque praesentium est dicta quisquam, maiores necessitatibus, autem magni nulla porro? Doloribus omnis ratione nemo facilis nisi facere distinctio ex temporibus corrupti ullam, cupiditate provident nihil repellat expedita fugiat, accusamus, autem odio! Atque sequi amet nesciunt inventore sunt quisquam repudiandae iure saepe eum maxime minus tenetur, voluptatibus eaque molestias, necessitatibus obcaecati dolorem dolorum ut magnam officiis mollitia est! Ut nisi qui perferendis, mollitia animi atque non nesciunt expedita quis nihil vel officia aspernatur fuga, iste neque ullam! Nesciunt, ad exercitationem repellendus saepe deleniti libero amet voluptates voluptatum temporibus quibusdam debitis reprehenderit sunt porro fugiat hic maxime nisi vel ullam enim suscipit quas totam quaerat beatae! Ad magni soluta magnam repellendus fuga provident.
      </section>
      </div>

      <div className='footer'>
        <button onClick={prevChapter}>Zurück</button>
        <button onClick={nextChapter}>Weiter</button>
      </div>
    </main>
  )
}

export default Main
