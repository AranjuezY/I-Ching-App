#!/usr/bin/env python3

import subprocess
import sys
from pathlib import Path

def run_script(script_name):
    """执行指定的Python脚本"""
    print(f"\n=== 正在执行 {script_name} ===")
    try:
        result = subprocess.run([sys.executable, script_name], check=True)
        print(f"√ {script_name} 执行成功")
        return True
    except subprocess.CalledProcessError as e:
        print(f"× {script_name} 执行失败: {e}")
        return False

def main():
    # 定义要按顺序执行的脚本列表
    scripts = [
        "tables.py",                        # 先创建表结构
        "migration-texts.py",               # 先导入文本数据
        "migration-hexagrams.py",           # 导入卦象数据
        "migration-yaos.py",                # 导入爻数据
        "relations-hexagrams-hexagrams.py", # 卦象关系
        "relations-text-hexagrams.py",      # 文本-卦象关系
        "relations-text-yaos.py"            # 文本-爻关系
    ]

    # 检查所有脚本是否存在
    missing_scripts = [s for s in scripts if not Path(s).exists()]
    if missing_scripts:
        print("错误：以下脚本不存在:")
        for ms in missing_scripts:
            print(f"  - {ms}")
        sys.exit(1)

    # 按顺序执行所有脚本
    all_success = True
    for script in scripts:
        if not run_script(script):
            all_success = False
            print("! 遇到错误，停止执行后续脚本")
            break

    # 最终状态报告
    print("\n=== 执行结果 ===")
    if all_success:
        print("✓ 所有脚本执行成功")
    else:
        print("✗ 部分脚本执行失败")

if __name__ == "__main__":
    main()