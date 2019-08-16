<template>
    <div>
        <el-input placeholder="请输入内容" v-model="keyword">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <el-table
            :data="tableData"
            style="width: 100%"
            v-loading="loading">
            <el-table-column
                prop="num"
                label="序号"
                width="80">
            </el-table-column>
            <el-table-column
                prop="city"
                label="城市"
                width="100">
            </el-table-column>
            <el-table-column
                prop="displaySource"
                label="来源"
                width="100">
            </el-table-column>
            <el-table-column
                prop="rentType"
                label="类型"
                width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.rentType === 0">未知</span>
                    <span v-if="scope.row.rentType === 1">合租</span>
                    <span v-if="scope.row.rentType === 3">整套出租</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="title"
                label="标题"
                width="250">
            </el-table-column>
            <el-table-column
                prop="price"
                label="租金">
            </el-table-column>
            <el-table-column
                prop="location"
                label="地点">
            </el-table-column>
            <el-table-column
                label="描述"
                width="250">
                <template slot-scope="scope">
                    <el-tooltip :content="scope.row.text" effect="light">
                        <div v-html="scope.row.text" style="
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 3;
                        -webkit-box-orient: vertical;"></div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
                prop="tags"
                label="关键字"
                width="160">
                <template slot-scope="scope">
                    <el-tag v-for="item in scope.row.tagsList" :key="item">{{item}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                label="链接">
                <template slot-scope="scope">
                    <a :href="scope.row.onlineURL">{{scope.row.onlineURL}}</a>
                </template>
            </el-table-column>
            <el-table-column
                label="图集"
                width="300">
                <template slot-scope="scope">
                    <el-image :src="item.replace(new RegExp('webp','g'), 'jpg')" v-for="(item, $index) in scope.row.pictures" :key="$index" :style="{width: '100px'}" :preview-src-list="scope.row.pictures" lazy></el-image>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 50, 100, 200]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
import api from '../api/api';

export default {
    data() {
        return {
            tableData: [],
            currentPage: 1,
            size: 10,
            total: 0,
            loading: false,
            keyword: {},
        };
    },
    mounted() {
        const form = {
            city: "深圳",
            rentType: 3,
            source: "",
            toPrice: "2000",
        };
        this.getData(form);
    },
    methods: {
        getData(form) {
            this.loading = true;
            api.houses(form).then((res) => {
                this.loading = false;
                if (res.data.success && res.data.success === true) {
                    const data = res.data.data;
                    for (let i = 0; i < data.length; i += 1){
                        data[i].num = i + 1;
                        if (data[i].tags != null) {
                            data[i].tagsList = data[i].tags.split('|');
                        }
                        
                    }
                    this.tableData = data;
                    this.total = data.length;
                }
            });
        },
        search() {},
    },
};
</script>
