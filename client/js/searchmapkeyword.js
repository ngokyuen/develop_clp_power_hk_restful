const {connect} = ReactRedux;

class SearchMapKeywordComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchMapKeyword: null,
      searchMapKeywordResult: null,
      showSearchMapKeywordResult: false,
      searchMapDetailResult: [],
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    //alert(nextState);
    if (nextState.searchMapKeywordResult != null && this.state.statesearchMapKeywordResult != nextState.searchMapKeywordResult){
      return true;
    }
    // else if (nextState.searchMapDetailResult.length > 0 && this.state.searchMapDetailResult.length != nextState.searchMapDetailResult.length){
    //   return true;
    // }

    return false;
  }

  clickSearchMapKeywordResultItem(place_id){
    console.log(place_id);
    this.feedGetMapDetailByPlaceId(place_id);
    // this.forceUpdate();
    this.changeSearchMapKeywordResult(false);
  }

  async feedGetMapDetailByPlaceId(place_id){
    try {
      const query = await fetch("http://localhost:81/coursework/api/api.php?format=json&lang=en&searchMapDetailByPlaceId=" + place_id);
      const response = await query.json();
      let array = this.state.searchMapDetailResult;
      array.push(response);
      this.setState({searchMapDetailResult: array});
      // this.forceUpdate();
      console.log(response);
    } catch (e){
      console.log(e);
    }
  }

  async feedSearchMapKeyword(keyword){
    try {
      const query = await fetch("http://localhost:81/coursework/api/api.php?format=json&lang=en&searchMapKeyword=" + keyword);
      const response = await query.json();
      this.setState({searchMapKeywordResult: response});
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  changeSearchMapKeyword(e){
    const keyword = encodeURI(e.target.value);
    this.setState({searchMapKeyword: keyword});

    if (keyword.length > 3) {
      setTimeout(()=>{
        if (keyword == this.state.searchMapKeyword){
          this.feedSearchMapKeyword(keyword);
        }
      },1000)
    }
  }

  changeSearchMapKeywordResult(request){
    this.setState({showSearchMapKeywordResult: request});
  }

  renderSearchMapResult(){
    if (this.state.searchMapKeywordResult != null && this.state.searchMapKeywordResult.stationList.station.status == "OK"){
      return <div style={{position:'absolute',width:900, zIndex:9999}}>{this.state.searchMapKeywordResult.stationList.station.predictions.map(search=>
        <div onClick={(e)=>this.clickSearchMapKeywordResultItem(search.place_id)} style={{ padding:20, borderStyle:'solid',borderWidth:1,backgroundColor:'white', width:860}} key={search.id}>
          <div>{search.description}</div>
        </div>
      )}</div>
    }
  }

  render(){
    return (
      <div style={{}} id="searchmap" ref="searchmap">
        <div onMouseEnter={()=>{this.changeSearchMapKeywordResult(false);this.changeSearchMapKeywordResult(true);}} onMouseLeave={()=>this.changeSearchMapKeywordResult(false)}  onBlur={()=>this.changeSearchMapKeywordResult(false)}>
          <div>Search</div>
          <div><input onChange={this.changeSearchMapKeyword.bind(this)} autoComplete="off" style={{width:"100%"}} type="text" name="searchmap_keyword" placeholder="Enter any place keywords" /></div>
          {(this.state.showSearchMapKeywordResult)?this.renderSearchMapResult():null}
        </div>
      </div>
    );
  }
}

const SearchMapKeyword = connect(state=>state,null)(SearchMapKeywordComponent);