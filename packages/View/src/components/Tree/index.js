import React from 'react';
import { Tree, Input, Icon } from 'antd';
import styles from "./index.less"

const { TreeNode } = Tree;
const { Search } = Input;

const filterTreeData = (data) => {
	return data.reduce((r, c) => {
		const {
			children,
			...rest
		} = c
		if (c.children) {
			const cache = filterTreeData(c.children)
			r.push(...cache)
		}
		r.push(rest)
		return r
	}, [])
}
const gData = []
const getParentKey = (key, tree) => {
	let parentKey;
	for (let i = 0; i < tree.length; i++) {
		const node = tree[i];
		if (key === node.key) {
			parentKey = node.key;
		} else if (node.children) {
			if (node.children.some(item => item.key === key)) {
				parentKey = node.key;
			} else if (getParentKey(key, node.children)) {
				parentKey = getParentKey(key, node.children);
			}
		}
	}
	return parentKey;
};

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expandedKeys: [],
			checkedKeys: this.props.checkedKeys ? this.props.checkedKeys : [],
			selectedKeys: this.props.selectedKeys ? this.props.selectedKeys : [],
			autoExpandParent: true,
			searchValue: '',
			defaultExpandedKeys: []
		};
	}
	componentDidMount() {
		const { defaultSelectedKey } = this.props;
		if (defaultSelectedKey) {
			this.setState({
				selectedKeys: defaultSelectedKey
			})
		}
	}
	onExpand(expandedKeys) {
		this.setState({ expandedKeys, autoExpandParent: false })
	};

	onCheck(checkedKeys, info) {
		console.log('onCheck', checkedKeys, info)
		if (this.props.checkStrictly) {
			this.setState({ checkedKeys: checkedKeys.checked })
			this.props.check
				? this
					.props
					.check(checkedKeys.checked)
				: ''
		} else {
			this.setState({ checkedKeys })
			this.props.check
				? this
					.props
					.check(checkedKeys, [
						...checkedKeys,
						...info.halfCheckedKeys
					])
				: ''
		}

	};

	onSelect(selectedKeys, info) {
		if (selectedKeys.length === 0) {
			const { selectedKeys: newSelectedKeys } = this.state;
			info.selected = true;
			setTimeout(() => { this.props.select ? this.props.select(newSelectedKeys, info) : '' })
		} else {
			this.setState({ selectedKeys })
			setTimeout(() => { this.props.select ? this.props.select(selectedKeys, info) : '' })

		}

	};
	clearSelectedKeys = () => {
		this.setState({
			selectedKeys: []
		})
	}
	renderTreeNodes(data) {
		return data.reduce((r, c) => {
			if (c.children && c.children.length && c.children != null) {
				const index = c.title.indexOf(this.state.searchValue);
				const beforeStr = c.title.substr(0, index);
				const afterStr = c.title.substr(index + this.state.searchValue.length);
				const title = index > -1
					? (
						<span>
							{beforeStr}
							<span
								style={{
									color: 'red'
								}}>{this.state.searchValue}</span>
							{afterStr}
						</span>
					)
					: (
						<span>{c.title}</span>
					);
				const caches = (
					c.icon ?
						<TreeNode
							dataRef={c}
							{...c.props}
							title={title}
							icon={< Icon type={
								c.icon
							} />}
							key={c.key}>
							{this.renderTreeNodes(c.children)}
						</TreeNode> :
						<TreeNode
							dataRef={c}
							{...c.props}
							title={title}
							key={c.key}>
							{this.renderTreeNodes(c.children)}
						</TreeNode>
				)
				r.push(caches)
			} else {
				const index = c.title.indexOf(this.state.searchValue);
				const beforeStr = c.title.substr(0, index);
				const afterStr = c.title.substr(index + this.state.searchValue.length);
				const title = index > -1
					? (
						<span>
							{beforeStr}
							<span
								style={{
									color: 'red'
								}}>{this.state.searchValue}</span>
							{afterStr}
						</span>
					)
					: (
						<span>{c.title}</span>
					);
				r.push(
					c.icon ?
						<TreeNode
							dataRef={c}
							{...c.props}
							icon={< Icon type={
								c.icon
							} />}
							title={c.title}
							key={c.key}
						/> :
						<TreeNode
							dataRef={c}
							{...c.props}
							title={c.title}
							key={c.key}
						/>
				)
			}
			return r
		}, [])
	}

	search(e) {
		const { treeData } = this.props;
		const { value } = e.target;
		const dataList = filterTreeData(treeData);
		// console.log(dataList)
		const expandedKeys = dataList.map(item => {
			if (item.title.indexOf(value) > -1) {
				return getParentKey(item.key, treeData);
			}
			return null;
		}).filter((item, i, self) => item && self.indexOf(item) === i);

		this.setState({ expandedKeys, searchValue: value, autoExpandParent: true });
	}
	render() {
		const { expandedKeys, checkedKeys, selectedKeys, searchValue, autoExpandParent } = this.state
		const scrollStyl = this.props.height
			? {
				width: this.props.width,
				height: this.props.height,
				overflowY: 'auto'
			}
			: {
				width: this.props.width
			}
		const { treeData } = this.props;
		let treeExpandedKeys = expandedKeys
		if (!treeExpandedKeys || !treeExpandedKeys.length) {
			if (treeData) {
				treeExpandedKeys = treeData.map(element => {
					return element.key;
				})
			}
		}

		// console.log(treeExpandedKeys)
		return (
			<div style={scrollStyl} className={styles.linktree}>
				{this.props.isSearch
					? <Search
						style={{
							marginBottom: 8
						}}
						placeholder="Search"
						onChange={this
							.search
							.bind(this)} />
					: ''
				}
				{
					this.props.treeData && this.props.treeData.length > 0 ?
						<Tree
							defaultExpandedKeys={treeExpandedKeys}
							checkable={this.props.checkable}
							checkStrictly={this.props.checkStrictly}
							showLine={true}
							showIcon={this.props.showIcon}
							height={this.props.height}
							// expandedKeys={expandedKeys}
							// autoExpandParent={autoExpandParent}
							onExpand={this
								.onExpand
								.bind(this)}
							onCheck={this
								.onCheck
								.bind(this)}
							checkedKeys={checkedKeys}
							onSelect={this
								.onSelect
								.bind(this)}
							selectedKeys={selectedKeys}
							{...this.props}>
							{this.renderTreeNodes(this.props.treeData)}
						</Tree> : ''}
			</div>
		)
	}
}