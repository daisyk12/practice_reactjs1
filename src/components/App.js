//@flow
import React, { Component } from 'react'
import TodoList from './TodoList'
import TodoItem from './TodoItem'
import TodoAddForm from './TodoAddForm'
import TodoEditForm from './TodoEditForm'
import axios from 'axios';



//匯入Item物件靜態類型的定義
import type { Item } from '../definitions/TodoTypeDefinition.js'

//匯入css檔
import '../style/bootstrap.css'
import '../style/animate.css'

class App extends Component {
  // 預先定義state的結構
  state: {
    items: Array<Item>,
  }

  //建構式
  constructor() {
    super()

    this.state = {
      items: [],
    }
  }
  componentDidMount() {
    // 元件"已經"載入，所以可以載入資料進來
    this.GET()
  }
  GET = async () => {
    try {
      //取得數據庫http://localhost:5555/items的數據
      const Data = await axios.get("http://127.0.0.1:7001/getDB");
      console.log(Data.data);
      const items = Data.data.map((item) => {
        return Object.assign({}, item, { isEditing: false })
      })
      this.setState({
        items,
      })

    }
    catch (error) {
      alert("GET Error!!");
    }

  };

POST = (aItem: Item) => {
  const { id, title, isCompleted } = aItem
  const payload = { id, title, isCompleted }
  axios.post("http://127.0.0.1:7001/addDB",payload);
};
PUT = (aItem: Item) => {
  //處理payload，不需要isEditing欄位
  const { id, title, isCompleted } = aItem
  const payload = { id, title, isCompleted }
  axios.put(`http://127.0.0.1:7001/updateDB/${id}`,payload)
};
//待修改
Delete = (aItem: Item) => {
  const { id, title, isCompleted } = aItem
  const payload = { id, title, isCompleted }
  axios.delete(`http://127.0.0.1:7001/removeDB/${id}`,payload)
};

  handleItemAdd = (aItem: Item) => {
    //加入新的項目到最前面
    //此處有變動
    const newItems = [aItem, ...this.state.items]

    //加入新資料到資料庫
    this.POST(aItem)

    //按下enter後，加到列表項目中並清空輸入框
    this.setState({
      items: newItems,
    })
  }

  //處理樣式變化其中一個陣列中成員的方法
  handleStylingItem = (index: number) => {
    //拷貝一個新陣列
     //待修改
    const newItems = [...this.state.items]

    //切換isCompleted的布林值
    newItems[index].isCompleted = !newItems[index].isCompleted
    this.Delete(newItems[index])
    this.GET();
    //整個陣列重新更新
    this.setState({
      items: newItems,
    })
  }
  

  //處理其中一個陣列中成員變為編輯中的方法
  handleEditItem = (index: number) => {
    //拷貝一個新陣列
    const newItems = [...this.state.items]

    //切換isEditing的布林值
    newItems[index].isEditing = !newItems[index].isEditing

    //整個陣列重新更新
    this.setState({
      items: newItems,
    })
  }

  //處理其中一個陣列中成員編輯完後更新的方法
  handleEditItemUpdate = (index: number, title: string) => {
    //拷貝一個新陣列
    const newItems = [...this.state.items]

    //項目的標題指定為傳入參數，更新標題
    newItems[index].title = title

    //切換isEditing的布林值
    newItems[index].isEditing = !newItems[index].isEditing

    //更新某一筆資料
    this.PUT(newItems[index])

    //整個陣列重新更新
    this.setState({
      items: newItems,
    })
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          <div className="panel panel-warning">
            <div className="panel-heading">
              <h3 className="panel-title">To do list</h3>
            </div>
            <div className="panel-body">
              <TodoAddForm placeholderText="按Enter鍵可以加入列表中" onItemAdd={this.handleItemAdd} />
              <TodoList>
                {
                  this.state.items.map((item, index) => (
                    (item.isEditing)
                      ? <TodoEditForm
                        key={item.id}
                        title={item.title}
                        onItemUpdate={(title) => { this.handleEditItemUpdate(index, title) }}
                      />
                      : <TodoItem
                        key={item.id}
                        isCompleted={item.isCompleted}
                        title={item.title}
                        onItemDoubleClick={() => { this.handleEditItem(index) }}
                        onItemClick={() => { this.handleStylingItem(index) }}
                      />
                  )
                  )
                }
              </TodoList>
            </div>
            <div className="panel-footer">雙點擊項目可以進行編輯，按下Enter後儲存</div>
          </div>
        </div>
      </div>
    )
  }
}

// 輸出App模組
export default App