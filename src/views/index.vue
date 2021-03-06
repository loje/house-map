<template>
  <div>
    <el-card>
      <el-form label-width="150px;">
        <el-form-item label="房源类型：">
          <el-select v-model="form.rentType" clearable>
            <el-option :key="index" :label="item.label" :placeholder="'请选择'" :value="item.value" v-for="(item, index) in rentList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="租金范围：">
          <el-input v-model="form.fromPrice" placeholder="最低价" :style="{width: '160px'}"></el-input>
          ~
          <el-input v-model="form.toPrice" placeholder="最高价" :style="{width: '160px'}"></el-input>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-tag
            :key="$index"
            v-for="(tag, $index) in form.keyword"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
            style="margin-right:10px;">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getData(form)"></el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table
      :data="tableData.slice((currentPage - 1) * size, currentPage * size)"
      @selection-change="handleSelectionChange"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="num" label="序号" width="80"></el-table-column>
      <el-table-column prop="city" label="城市" width="100"></el-table-column>
      <el-table-column prop="displaySource" label="来源" width="100"></el-table-column>
      <el-table-column prop="rentType" label="类型" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.rentType === 0">未知</span>
          <span v-if="scope.row.rentType === 1">合租</span>
          <span v-if="scope.row.rentType === 2">单间</span>
          <span v-if="scope.row.rentType === 3">整套出租</span>
          <span v-if="scope.row.rentType === 4">公寓</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="250">
        <template slot-scope="scope">
          <div v-if="scope.row.title.indexOf('求租') !== -1" style="color:#ccc;">{{scope.row.title}}</div>
          <div v-else-if="scope.row.title.indexOf('公寓') !== -1" style="color:#ccc;">{{scope.row.title}}</div>
          <div v-else-if="scope.row.title.indexOf('店') !== -1" style="color:#ccc;">{{scope.row.title}}</div>
          <div v-else-if="scope.row.title.indexOf('一厅') !== -1" style="font-weight: bold;">{{scope.row.title}}</div>
          <div v-else-if="scope.row.title.indexOf('1厅') !== -1" style="font-weight: bold;">{{scope.row.title}}</div>
          <div v-else-if="scope.row.title.indexOf('整租') !== -1" style="font-weight: bold;">{{scope.row.title}}</div>
          <div v-else>{{scope.row.title}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="租金">
        <template slot-scope="scope">
          <span v-if="scope.row.price === -1" style="color:#ccc;">未知租金</span>
          <span v-else>￥{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="location" label="地点" width="250"></el-table-column>
      <el-table-column label="描述" width="250">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.text" effect="light">
            <div
              v-html="scope.row.text"
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;"
            ></div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="关键字" width="160">
        <template slot-scope="scope">
          <el-tag v-for="(item, $index) in scope.row.tagsList" :key="$index" :style="{marginRight: '5px'}">{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="链接">
        <template slot-scope="scope">
          <a :href="scope.row.onlineURL" target="blank">打开链接</a>
        </template>
      </el-table-column>
      <el-table-column label="图集" width="120">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            trigger="hover"
            maxWidth="500"
            >
            <template v-for="(item, $index) in scope.row.pictures">
              <el-image
                :src="item.replace(new RegExp('webp','g'), 'jpg')"
                :preview-src-list="scope.row.pictures"
                :style="{width: '100px'}"
                :key="$index"></el-image>
            </template>
            <el-button slot="reference">查看图集</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="发布时间">
        <template slot-scope="scope">
          {{new Date(scope.row.pubTime).toLocaleDateString()}}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-sizes="[5, 10, 50, 100, 200]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="closeDialog">
      <template v-for="(item, $index) in pictures">
        <el-image
          :src="`${item.replace(new RegExp('webp','g'), 'jpg')}`"
          :preview-src-list="pictures"
          :style="{width: '200px'}"
          :key="$index"></el-image>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from "../api/api";

export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      size: 10,
      total: 0,
      loading: false,
      rentList: [
        {
          label: "未知",
          value: 0,
        },
        {
          label: "合租",
          value: 1,
        },
        {
          label: "单间",
          value: 2,
        },
        {
          label: "整套出租",
          value: 3,
        },
        {
          label: "公寓",
          value: 4,
        },
      ],
      form: {
        city: "深圳", // 城市
        rentType: '', // 房源类型
        source: '', // 房源
        fromPrice: undefined, // 最低价
        toPrice: undefined, // 最高价
        keyword: [],
      },
      inputVisible: false,
      inputValue: '',

      dialogTitle: '',
      pictures: [],
      dialogFormVisible: false,
    };
  },
  mounted() {
    this.getData(this.form);
  },
  methods: {
    getData(form) {
      this.loading = true;
      api.houses({
        ...form,
        keyword: form.keyword && form.keyword.length > 0 ? form.keyword.toString() : undefined,
        rentType: form.rentType ? form.rentType : undefined,
      }).then(res => {
        this.loading = false;
        if (res.data.success && res.data.success === true) {
          const data = res.data.data;
          const arr = [];
          if (res.data.data) {
            
            for (let i = 0; i < data.length; i += 1) {
              data[i].num = i + 1;
              data[i].tagsList = [];
              if (data[i].tags !== null && data[i].tags !== '|') {
                data[i].tagsList = data[i].tags.split("|");
              }

              if (data[i].title.indexOf('一室一厅') != -1 || data[i].title.indexOf('一房一厅') != -1) {
                data[i].tagsList.push('一房一厅');
              }

              if (data[i] && data[i].title.indexOf('求租') === -1 && 
                  data[i] && data[i].title.indexOf('公寓') === -1 && 
                  data[i] && data[i].title.indexOf('店') === -1 && 
                  data[i] && data[i].title.indexOf('限女') === -1 && 
                  data[i] && data[i].title.indexOf('次卧') === -1 && 
                  data[i] && data[i].title.indexOf('主卧') === -1 && 
                  data[i] && data[i].title.indexOf('蛋壳') === -1 && 
                  data[i] && data[i].title.indexOf('自如') === -1 && 
                  data[i] && data[i].title.indexOf('合租') === -1 && 
                  data[i] && data[i].title.indexOf('管家') === -1 && 
                  data[i] && data[i].title.indexOf('0厅') === -1 && 
                  // data[i] && data[i].title.indexOf('办公') === -1 && 
                  data[i] && data[i].title.indexOf('写字楼') === -1 && 
                  data[i] && data[i].title.indexOf('室友') === -1) {
                arr.push(data[i]);
              }
            }
          }
          
          this.tableData = arr ? arr : [];
          this.currentPage = 1;
          this.total = arr.length;
        }
      });
    },
    handleCurrentChange(cpage) {
      this.currentPage = cpage;
    },
    handleSizeChange(psize) {
      this.size = psize;
    },
    handleSelectionChange(val) {
      console.log(val);
    },
    handleClose(tag) {
      this.form.keyword.splice(this.form.keyword.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.form.keyword.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    priview(row) {
      this.dialogTitle = row.title;
      this.pictures = row.pictures;
      this.dialogFormVisible = true;
    },
    closeDialog() {
      this.dialogTitle = ''
      this.pictures = [];
      this.dialogFormVisible = false;
    },
  },
};
</script>
