import React, { useState, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';

const ItemTypes = {
  PLAYER: 'player'
};

const playersData = [
  { name: '佐藤 翔太', height: 175, weight: 70, branch: '東京道場', class: '70kg級' },
  { name: '鈴木 健一', height: 180, weight: 75, branch: '大阪道場', class: '80kg級' },
  { name: '高橋 悠人', height: 170, weight: 65, branch: '名古屋道場', class: '60kg級' },
  { name: '田中 直樹', height: 185, weight: 80, branch: '福岡道場', class: '80kg級' },
  { name: '伊藤 陽介', height: 178, weight: 72, branch: '札幌道場', class: '70kg級' },
  { name: '山本 拓真', height: 182, weight: 78, branch: '東京道場', class: '80kg級' },
  { name: '中村 颯太', height: 168, weight: 60, branch: '大阪道場', class: '60kg級' },
  { name: '小林 智也', height: 190, weight: 85, branch: '沖縄道場', class: '80kg級' },
];

// カスタムフィルターコンポーネント - 数値範囲
const NumberRangeFilter = ({ column }) => {
  return (
    <div className="flex gap-2">
      <input
        type="number"
        value={column.getFilterValue()?.[0] ?? ''}
        onChange={e => {
          const val = e.target.value;
          column.setFilterValue(prev => [val, prev?.[1]]);
        }}
        placeholder="最小"
        className="w-20 border rounded p-1"
      />
      <input
        type="number"
        value={column.getFilterValue()?.[1] ?? ''}
        onChange={e => {
          const val = e.target.value;
          column.setFilterValue(prev => [prev?.[0], val]);
        }}
        placeholder="最大"
        className="w-20 border rounded p-1"
      />
    </div>
  );
};

// カスタムフィルターコンポーネント - 所属選択
const SelectFilter = ({ column, options }) => {
  return (
    <select
      value={column.getFilterValue() ?? ''}
      onChange={e => column.setFilterValue(e.target.value)}
      className="border rounded p-1 w-full"
    >
      <option value="">全て</option>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
// PlayersTable コンポーネントの引数に placedPlayers を追加
const PlayersTable = ({ placedPlayers }) => {
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: '名前',
      },
      {
        accessorKey: 'height',
        header: '身長',
        filterFn: 'between',
        Filter: NumberRangeFilter,
      },
      {
        accessorKey: 'weight',
        header: '体重',
        filterFn: 'between',
        Filter: NumberRangeFilter,
      },
      {
        accessorKey: 'branch',
        header: '所属',
        filterFn: 'equals',
        Filter: (props) => <SelectFilter {...props} options={Array.from(new Set(playersData.map(player => player.branch)))} />,
      },
      {
        accessorKey: 'class',
        header: '階級',
        filterFn: 'equals',
        Filter: (props) => <SelectFilter {...props} options={Array.from(new Set(playersData.map(player => player.class)))} />,
      },
    ],
    []
  );

  // カスタムフィルター関数の定義
  const filterFns = {
    between: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      const [min, max] = filterValue || [];

      // 空文字列を undefined として扱う
      const minVal = min === '' ? undefined : Number(min);
      const maxVal = max === '' ? undefined : Number(max);

      // フィルター値が未設定の場合は真を返す
      if (minVal === undefined && maxVal === undefined) return true;

      // 最小値のみ指定
      if (maxVal === undefined) return value >= minVal;

      // 最大値のみ指定
      if (minVal === undefined) return value <= maxVal;

      // 両方指定
      return value >= minVal && value <= maxVal;
    }
  };

  const table = useReactTable({
    data: playersData,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns,
    enableColumnFilters: true,
  });

  return (
    <div>
      <table className="min-w-full border bg-white">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="border p-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getCanFilter() ? (
                    <div>
                      {header.column.columnDef.Filter && (
                        <header.column.columnDef.Filter
                          column={header.column}
                        />
                      )}
                    </div>
                  ) : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <DraggableTableRow
              key={row.id}
              row={row}
              placedPlayers={placedPlayers}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DraggableTableRow = ({ row, placedPlayers }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PLAYER,
    item: () => ({
      player: row.original,  // 選手の全情報を渡す
      fromTable: true
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const isPlaced = placedPlayers.has(row.original.name);

  return (
    <tr
      ref={drag}
      className={`
        cursor-move 
        hover:bg-gray-100 
        ${isDragging ? 'opacity-50' : ''} 
        ${isPlaced ? 'bg-gray-200' : ''}
      `}
    >
      {row.getVisibleCells().map(cell => (
        <td key={cell.id} className="border p-2">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

const DraggablePlayer = ({ player, index, isPlaced = false, fromBracket = false }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PLAYER,
    item: () => ({
      player,
      index,
      fromBracket
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      className={`p-2 border rounded shadow 
        ${isDragging ? 'opacity-50' : ''} 
        ${isPlaced ? 'bg-gray-200' : 'bg-white'} 
        cursor-move w-full`}
    >
      <div className="font-bold">{player.name}</div>
      <div className="slotInfoWrap text-sm text-gray-600">
        <p>身長: {player.height}cm / 体重: {player.weight}kg</p>
        <p>{player.branch}</p>
        <p>{player.class}</p>
      </div>
    </div>
  );
};

const BracketSlot = ({ onDrop, player, index, onRemove }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.PLAYER,
    drop: (item) => onDrop(item, index),
    canDrop: () => true,
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <div
      ref={drop}
      className={`slotWrapper p-2 border rounded ${isOver ? 'bg-gray-100' : 'bg-white'}`}
    >
      {player ? (
        <div className="flex items-center justify-between gap-2">
          <DraggablePlayer
            player={player}
            index={index}
            isPlaced={true}
            fromBracket={true}
          />
          <div className="flex flex-col gap-2">
            {onRemove && (
              <span
                className="text-red-500 text-sm cursor-pointer remove"
                onClick={() => onRemove(index)}
              >
                解除
              </span>
            )}
          </div>
        </div>
      ) : (
        <span className="text-gray-400">未設定</span>
      )}
    </div>
  );
};

const TournamentBracket = () => {
  const [playerCount, setPlayerCount] = useState(32);
  const [brackets, setBrackets] = useState(() => {
    // 初期スロットを生成
    const initialBrackets = {};
    for (let i = 0; i < 4; i++) {
      initialBrackets[i] = null;
    }
    return initialBrackets;
  });

  // スロット数変更時の処理
  const handlePlayerCountChange = (e) => {
    const newCount = parseInt(e.target.value);
    setPlayerCount(newCount);

    // bracketsを新しい数で初期化
    const newBrackets = {};
    for (let i = 0; i < newCount; i++) {
      newBrackets[i] = null;
    }
    setBrackets(newBrackets);
    setPlacedPlayers(new Set()); // 配置済みプレイヤーもリセット
  };

  // プレイヤーの配置状態を管理
  const [placedPlayers, setPlacedPlayers] = useState(new Set());

  const handleDrop = (item, targetBracketIndex) => {

    // プレイヤーを配置済みとしてマーク
    setPlacedPlayers(prev => new Set([...prev, item.player.name]));

    // ブラケットにプレイヤーを設定
    setBrackets(prevBrackets => {
      const newBrackets = { ...prevBrackets };

      if (item.fromBracket) {
        // ドラッグ元のブラケットに、ドロップ先のプレイヤーを設定
        const draggedPlayer = item.player;
        const targetPlayer = newBrackets[targetBracketIndex];

        // ドラッグ元のブラケットインデックスを見つける
        const sourceBracketIndex = Object.entries(newBrackets).find(
          ([_, player]) => player && player.name === draggedPlayer.name
        )[0];

        // プレイヤーを入れ替える
        newBrackets[sourceBracketIndex] = targetPlayer;
        newBrackets[targetBracketIndex] = draggedPlayer;
      } else {
        // プレイヤーリストからの新規配置の場合
        if (newBrackets[targetBracketIndex]) {
          // 既存のプレイヤーがいる場合は何もしない
          return prevBrackets;
        }

        setPlacedPlayers(prev => new Set([...prev, item.player.name]));
        newBrackets[targetBracketIndex] = item.player;
      }

      return newBrackets;
    });
  };

  // 解除ボタン押下時の処理
  const handleRemovePlayer = (bracketIndex) => {
    setBrackets(prevBrackets => {
      const newBrackets = { ...prevBrackets };
      const removedPlayer = newBrackets[bracketIndex];
      newBrackets[bracketIndex] = null;

      // プレイヤーの配置状態を更新
      setPlacedPlayers(prev => {
        const newPlacedPlayers = new Set(prev);
        if (removedPlayer) {
          newPlacedPlayers.delete(removedPlayer.name);
        }
        return newPlacedPlayers;
      });

      return newBrackets;
    });
  };

  return (
    <div className="p-4">
      <div className="mb-8">

        <div className="mb-4">
          <label htmlFor="playerCount" className="mr-2">参加人数:</label>
          <select
            id="playerCount"
            value={playerCount}
            onChange={handlePlayerCountChange}
            className="border rounded p-1"
          >
            {[32, 64, 128].map(num => (
              <option key={num} value={num}>{num}人</option>
            ))}
          </select>
        </div>

        <h2 className="text-xl font-bold my-4">トーナメント表</h2>
        <div className={`tournamentWrapper grid grid-cols-[1fr_1fr] overflow-scroll totalBlocks__${Math.ceil(playerCount / 32)}`}>
          {Array.from({ length: Math.ceil(playerCount / 32) }, (_, blockIndex) => (
            <div
              key={`block-${blockIndex}`}
              className={`
              tournamentBlockWrapper flex justify-between 
              ${blockIndex % 2 === 1 ? 'tournamentBlockWrapper__even' : ''} 
              ${blockIndex > 1 ? 'tournamentBlockWrapper__65-128' : ''}`}>
              <div className="tournamentRoundWrapper flex flex-row items-center">
                <div className="flex justify-between flex-col">
                  {Array.from({ length: Math.min(32, playerCount - blockIndex * 32) }, (_, index) => (
                    <BracketSlot
                      key={`bracket-${blockIndex * 32 + index}`}
                      player={brackets[blockIndex * 32 + index]}
                      index={blockIndex * 32 + index}
                      onDrop={handleDrop}
                      onRemove={handleRemovePlayer}
                    />
                  ))}
                </div>
                {Array.from({ length: 5 }, (_, index) => (  // Revert lại thành 5 rounds cố định
                  <div
                    key={`round-${index}`}
                    className={`tournamentRound flex justify-cente flex-col Round-${index + 1}`}
                  >
                    {Array.from({ length: Math.min(32, playerCount - blockIndex * 32) / Math.pow(2, index + 1) }, (_, borderindex) => (
                      <div key={`round-${index}-${borderindex}`} className="tournamentBorderWrapper">
                        <div className="tournamentBorder tournamentBorder_top"></div>
                        <div className="tournamentBorder tournamentBorder_buttom"></div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className={`
                blockWiner tournamentBorder
                ${[32, 64].includes(playerCount) ? 'tournamentBorder__RightNone' : ''}
              `}></div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4 mt-8">選手一覧</h2>
        <div className="flex flex-wrap gap-2 p-4 bg-gray-100 rounded min-h-16">
          <PlayersTable placedPlayers={placedPlayers} />
        </div>
      </div>
    </div>
  );
};

const ViewItemPage = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-blue-500 text-white p-4 rounded">
        Test Tailwind
      </div>
      <TournamentBracket />
    </DndProvider>
  );
};

export default ViewItemPage;