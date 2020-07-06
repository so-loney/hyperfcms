<?php

declare (strict_types=1);
namespace App\Models;

/**
 * @property int $id 
 * @property int $parent_id 
 * @property string $name 
 * @property string $display_name 
 * @property string $effect_uri 
 * @property string $description 
 * @property int $order 
 * @property \Carbon\Carbon $created_at 
 * @property \Carbon\Carbon $updated_at 
 */
class SystemPermission extends BaseModel
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'system_permissions';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['id', 'parent_id', 'name', 'display_name', 'effect_uri', 'description', 'order', 'created_at', 'updated_at'];
    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = ['id' => 'integer', 'parent_id' => 'integer', 'order' => 'integer', 'created_at' => 'datetime', 'updated_at' => 'datetime'];
    /**
     * getList
     * 获取系统权限列表
     * User：YM
     * Date：2020/2/3
     * Time：下午4:22
     * @param array $where
     * @param array $order
     * @return array
     */
    public function getList($where = [], $order = [])
    {
        $query = $this->query()->select($this->table . '.id', $this->table . '.parent_id', $this->table . '.parent_id', $this->table . '.display_name', $this->table . '.name', $this->table . '.effect_uri', $this->table . '.description');
        // 循环增加查询条件
        foreach ($where as $k => $v) {
            if ($v || $v != null) {
                $query = $query->where($this->table . '.' . $k, $v);
            }
        }
        // 追加排序
        if ($order && is_array($order)) {
            foreach ($order as $k => $v) {
                $query = $query->orderBy($this->table . '.' . $k, $v);
            }
        }
        $query = $query->get();
        return $query ? $query->toArray() : [];
    }
    /**
     * getPermissionsCount
     * 根据条件获取权限的个数
     * User：YM
     * Date：2020/2/4
     * Time：下午9:20
     * @param array $where
     * @return int
     */
    public function getPermissionsCount($where = [])
    {
        $query = $this->query();
        foreach ($where as $k => $v) {
            $query = $query->where($k, $v);
        }
        $query = $query->count();
        return $query > 0 ? $query : 0;
    }
}