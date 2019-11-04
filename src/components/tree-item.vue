<template>
  <div :class="tdClass">
    <span class="before-line" v-if="root !== 0 && nodes !== 1" :style="{'left':model.bLeft + 'px'}"></span>
    <table>
      <tr>
        <td :colspan="colSpan">
          <table>
              <tr class="leve" :class="levelClass">
                <td class="td1">
                  <div class="td-title" @dblclick="handlerExpand(model)">
                    <span v-if="model.children && model.children.length > 0" class="tree-close" :class="{'tree-open':model.isExpand}" @click="handlerExpand(model)"></span>
                    <a class="ellipsis">
                      <!-- <input type="checkbox" :name="model.name" :value="model.isChecked" @click="handlerChecked(model)"/> -->
                      <i v-if="model.children && model.children.length" class="t-icon m-dep"></i>
                      <i v-else class="el-icon-document"></i>
                      <span :title="model.name">{{model.name}}</span>
                    </a>
                  </div>
                </td>
                <td class="td2">
                  {{model.code}}
                </td>
                <td class="td3">{{model.method}}</td>
                <td class="td4">
                  <span :title="model.createOperator" class="ellipsis">{{model.createOperator}}</span>
                </td>
                <td class="td5" v-if="wms === '1'">{{checkedwmsBelong(model.belong)}}</td>
                <td class="td5" v-if="wms === '0'">{{checkedBelong(model.belong)}}</td>
                <td class="td6">
                  <a class="reset" href="javascript:;" @click="addFunc(model)" v-if="model.level === 1">新增二级资源</a>
                  <a class="reset" href="javascript:;" @click="addFunc(model)" v-else-if="model.level === 2 || model.level === 3">新增三级资源</a>
                  <a class="reset" href="javascript:;" @click="addFunc(model)" v-else></a>
                  <i class="line" v-if="model.level === 1 || model.level === 2 || model.level === 3"></i>
                  <a class="reset" href="javascript:;" @click="editFunc(model)">编辑</a>
                </td>
              </tr>
          </table>
        </td>
      </tr>
      </table>
      <div v-show="model.isExpand" class="other-node" :class="otherNodeClass">
        <tree-item
          v-for="(m, i) in model.children"
          :key="String('child_node'+i)"
          :num='i'
          :root="1"
          @addFunc="addFunc"
          @editFunc="editFunc"
          @handlerExpand="handlerExpand"
          @handlerChecked="handlerChecked"
          :nodes.sync='model.children.length'
          :trees.sync='trees'
          :model.sync="m"
          :wms='wms'>
        </tree-item>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'treeItem',
				props: ['model', 'num', 'nodes', 'root', 'trees', 'wms'],
				data() {
					return {
						parentNodeModel: null
					};
				},
				computed: {
					colSpan() {
						return this.root === 0 ? '' : 6;
					},
					tdClass() {
						return this.root === 0 ? 'td-border' : 'not-border';
					},
					levelClass() {
						return this.model ? 'leve-' + this.model.level : '';
					},
					childNodeClass() {
						return this.root === 0 ? '' : 'child-node';
					},
					otherNodeClass() {
						return this.model ? 'other-node-' + this.model.level : '';
					}
				},
				watch: {
					// 'model': {
					// 	handler() {
					// 		console.log('对象变化', this.model.isExpand)
					// 	},
					// 	deep: true
					// }
				},
				methods: {
					getParentNode(m) {
						// 查找点击的子节点
						let recurFunc = (data, list) => {
							data.forEach((l) => {
								if (l.id === m.id) this.parentNodeModel = list;
								if (l.children) {
									recurFunc(l.children, l);
								}
							});
						};
						recurFunc(this.trees, this.trees);
					},
					handlerExpand(m) {
            this.$emit('handlerExpand', m);
					},
					handlerChecked(m) {
            this.$emit('handlerChecked', m);
          },
          // 翻译
          checkedwmsBelong(belong) {
            let str = '';
            if (belong === 1) {
              str = '仓级权限';
            }
            return str;
          },
          // 翻译
          checkedBelong(belong) {
            let str = '';
            if (belong === 1) {
              str = '全局角色';
            } else if (belong === 2) {
              str = '渠道角色';
            }
            return str;
          },
          // 编辑
					editFunc(m) {
						this.$emit('editFunc', m);
						// this.getParentNode(m)
						// console.log(this.parentNodeModel)
						// if (this.parentNodeModel.hasOwnProperty('children')) {
						// 	console.log('父级是跟节点', this.parentNodeModel)
						// 	this.parentNodeModel.children.splice(this.parentNodeModel.children.indexOf(m), 1)
						// } else if (this.parentNodeModel instanceof Array) {
						// 	console.log('跟节点', this.parentNodeModel)
						// 	this.parentNodeModel.splice(this.parentNodeModel.indexOf(m), 1)
						// }
          },
          // 新增资源
					addFunc(m) {
						this.$emit('addFunc', m);
					}
				},
				filters: {
					formatDate: function(date) {
            // 后期自己格式化
						return date; // Utility.formatDate(date, 'yyyy/MM/dd')
					}
				}
  };
</script>
