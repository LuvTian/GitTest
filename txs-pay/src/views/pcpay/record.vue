<template>
  <div class="record-box" v-loading="loading2">
    <div class="record">
      <h3>交易记录</h3>
      <div class="record-detail">
        <el-tabs @tab-click="tabClick" v-if="tabs.length">
          <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.name">
          </el-tab-pane>
        </el-tabs>
        <el-table :data="recordLists" stripe style="width: 100%">
          <el-table-column prop="created" label="时间"></el-table-column>
          <el-table-column prop="detailtext" label="交易"></el-table-column>
          <el-table-column label="金额（元）">
            <template slot-scope="scope">
              <span class="red" v-if="scope.row.status==2 && scope.row.direction"><b> {{ scope.row.tranamount }} </b></span>
              <span class="green" v-else-if="scope.row.status==2 && !scope.row.direction"><b> {{ scope.row.tranamount }} </b></span>
              <span v-else><b> {{ scope.row.tranamount }} </b></span>
            </template>
          </el-table-column>
          <el-table-column prop="statustext" label="状态"></el-table-column>
          <div slot="empty">
            <div>
              <img src="../../assets/pcpay/no_record_pic.png" alt="" width="140" height="140" />
            </div>
            <p :style="{'marginTop': '23px'}">未查询到您的交易记录</p>
          </div>
        </el-table>
      </div>
    </div>
    <div class="pagination-box" v-if="!!totalPage">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getRecordList } from "@/api/pcpay";
import { fmoney } from "@/utils/index";

export default {
  data() {
    return {
      loading2: true, //交易记录部分的loading动画
      tabs: [], //tab标签数组
      transType: 0, //交易记录类型
      recordLists: [], //交易记录数据
      highlightId: -1,
      currentPage: 1, //当前页码
      pageIndex: 1, //查询的页码
      pageSize: 10, //每页的数据条数
      totalPage: 0, //默认总页数
      totalCount: 0 //默认数据总数
    };
  },
  created() {
    this._getTabs();
    this._getRecordList();
  },
  methods: {
    //生成tabs
    _getTabs() {
      let tabsData = [
        {
          name: "全部",
          value: 0
        },
        {
          name: "转入",
          value: 1
        },
        {
          name: "转出",
          value: 2
        },
        {
          name: "投资",
          value: 3
        },
        {
          name: "赎回",
          value: 4
        }
      ];
      this.tabs = tabsData;
    },
    //每次点击tab，将currentPage重新置为1
    tabClick(tab, event) {
      this.currentPage = 1;
      //小心这里可能有坑，如果接口文档变动，transType这样取就可能不行了
      this.transType = parseInt(tab.index);
      this._getRecordList();
    },
    _getRecordList() {
      this.loading2 = true;
      let obj = {
        platform: 1, //平台名称
        pageIndex: this.currentPage, //请求第几页
        pageSize: this.pageSize, //每页记录数
        transType: this.transType //记录类型
      };
      getRecordList(obj)
        .then(res => {
          if (res.code == 200 && res.data) {
            this.recordLists = res.data.data.map(item => {
              if (item.direction) {
                item.tranamount = "+" + fmoney(item.tranamount);
              } else {
                item.tranamount = "-" + fmoney(item.tranamount);
              }
              if (!item.statustext) {
                item.statustext = "--";
              }
              return item;
            });
            this.totalPage = res.data.totalPage;
            this.totalCount = res.data.totalCount;
          }
          this.loading2 = false;
          // this.totalPage = 0;
          // this.recordLists = [];
        })
        .catch(() => {
          this.loading2 = false;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      console.log(`每页 ${val} 条`);
      this._getRecordList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
      this._getRecordList();
    }
  }
};
</script>

<style>
.record-box {
  position: relative;
  background-color: #fff;
  min-height: 625px;
  padding-bottom: 100px;
}
.record {
  position: relative;
  min-height: 544px;
  width: 960px;
  margin: 0 auto;
}
.record-detail {
  position: relative;
  height: 100%;
}
.pagination-box {
  position: absolute;
  bottom: 34px;
  right: 60px;
}

/* 重写Element-ui样式 */
.record h3 {
  font-size: 16px;
  color: #333333;
  line-height: 16px;
  padding: 30px 0 15px;
}
.el-table__empty-block {
  min-height: 450px !important;
}
.record-box .el-table td,
.record-box .el-table th {
  padding: 8px 0;
}
.el-tabs__item {
  position: relative;
  font-size: 14px;
  color: #333;
  font-weight: bold;
}
.el-tabs__item::after {
  display: block;
  position: absolute;
  right: 0;
  top: 15px;
  height: 10px;
  border-right: 1px solid #e6e6e6;
  content: " ";
}
.el-tabs__item.is-active {
  font-size: 14px;
  color: #fc6333;
}
.el-tabs__item:hover {
  color: #fc6333;
}
.el-tabs__active-bar {
  background-color: #fc6333;
}
.record-detail .el-tabs__nav-scroll {
  padding-left: 36px;
}
.has-gutter th {
  background-color: #f5f5f5;
  font-size: 12px;
  color: #333333;
}
.el-table td,
.el-table th.is-leaf {
  border-bottom: none;
}

.el-table_1_column_1 .cell {
  text-align: center;
}
.el-table_1_column_2 .cell {
  text-align: left;
  padding-left: 40px;
}
.el-table_1_column_3 .cell {
  text-align: right;
  padding-right: 40px;
}
.el-table_1_column_4 .cell {
  text-align: center;
}
.record-detail .red {
  color: #fc6333;
}
.record-detail .green {
  color: #47991f;
}
.el-table {
  font-size: 12px;
}
.el-table::before {
  height: 0;
}
.el-pager li {
  font-size: 12px;
  color: #333;
  font-weight: normal;
  height: 16px;
  line-height: 16px;
  padding: 0 2px;
  min-width: 16px;
  margin: 0 8px;
}
.el-pager li.active {
  color: #fff;
  background: #fc6333;
  border-radius: 3px;
}
.el-pager {
  margin-top: 5px;
}
.el-pagination__jump .el-input__inner {
  font-weight: normal;
}
.el-pagination button, .el-pagination span:not([class*=suffix]) {
  font-size: 12px;
  color: #333;
}
.el-tabs__nav-wrap::after {
  height: 1px;
}
</style>