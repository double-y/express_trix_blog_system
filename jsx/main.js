'use strict'

var React = require('react');
var ReactDOM = require('react-dom');

function getTrixParser(){
    return document.querySelector("trix-editor#trix_parser");
}

var BlogList = React.createClass({
    fetchEditorJsons: function(){
        //localStorage["editorStorage"] = JSON.stringify([]);
        if(localStorage["editorStorage"]){
            var editorJsons = JSON.parse(localStorage["editorStorage"]);
            return editorJsons;
        }else{
            localStorage["editorStorage"] = JSON.stringify([]);
            return [];
        }
    },
    render: function(){
        var editorJsons = this.fetchEditorJsons();
        var columns = editorJsons.map(function(editorJson, index){
            return <BlogColumn trixjson={editorJson} blog_index={index}/>
        });
        return (<ul id="article_ul">{columns}</ul>);
    }
});

var BlogColumn = React.createClass({
    getInitialState: function() {
        return {
            isUpdateMode: false,
            trixJson: this.props.trixjson
        };
    },
    parseTrixJsonToHtml: function(json){
        getTrixParser().editor.loadJSON(json)
        return getTrixParser().innerHTML;
    },
    openUpdateBox: function(component, event) {
        this.setState({isUpdateMode: true});
    },
    closeUpdateBox: function(component, event) {
        this.setState({isUpdateMode: false});
    },
    updateBlog: function(trixjson){
        var editorJsons = JSON.parse(localStorage["editorStorage"]);
        editorJsons[this.props.blog_index] = trixjson;
        localStorage["editorStorage"] = JSON.stringify(editorJsons);
        this.setState({trixJson: trixjson});
    },
    render: function(){
        var articleHtml = this.parseTrixJsonToHtml(this.state.trixJson);
        if(this.state.isUpdateMode){
            return (
                <li>
                    <div class='trix-content' dangerouslySetInnerHTML={{__html: articleHtml}}></div>
                    <UpdateBlogBox
                        closeUpdateBox={this.closeUpdateBox}
                        trixjson={this.state.trixJson}
                        updateBlog={this.updateBlog}
                    />
                </li>);
        }else{
            return (<li onClick={this.openUpdateBox.bind(null, this)}><div class='trix-content' dangerouslySetInnerHTML={{__html: articleHtml}}></div><hr/></li>);
        }
    }
});

var AddBlogBox = React.createClass({
    addBlog: function(event){
        event.preventDefault();
        var trixeditor = document.querySelector('trix-editor#add_blog_editor').editor;
        var editorStorage = JSON.parse(localStorage["editorStorage"]);
        editorStorage.push(trixeditor);
        localStorage["editorStorage"] = JSON.stringify(editorStorage);
        ReactDOM.render(
            <BlogList/>,
            document.getElementById('article_list')
        );
    },
    render: function(){
        return (
            <div>
                <trix-editor id='add_blog_editor'></trix-editor>
                <a onClick={this.addBlog}>submit</a>
            </div>
        )
    }
});

var UpdateBlogBox = React.createClass({
    getInitialState: function() {
        return {
            isUpdateMode: false,
            trixJson: this.props.trixjson
        };
    },
    updateBlog: function(event){
        event.preventDefault();
        var editorJson = JSON.parse(JSON.stringify(this._editor));
        this.props.updateBlog(editorJson);
        this.setState({trixJson: editorJson});
    },
    closeBox: function(event){
        this.props.closeUpdateBox();
    },
    setTrixEditor: function(dom){
        if(dom){
            dom.editor.loadJSON(this.state.trixJson);
            this._editor = dom.editor;
        }
    },
    render: function(){
        return (
            <div>
                <a onClick={this.closeBox}>close</a>
                <div>
                    <trix-editor id='update_blog_editor' ref={(dom) => this.setTrixEditor(dom)}></trix-editor>
                    <a onClick={this.updateBlog}>update</a>
                </div>
            </div>
        )
    }
});

ReactDOM.render(
    <BlogList/>,
    document.getElementById('article_list')
);

ReactDOM.render(
    <AddBlogBox/>,
    document.getElementById('blog_form')
)