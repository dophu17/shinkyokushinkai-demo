import React, { useState, useMemo, useEffect } from 'react';
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
  { id: 1, name: '佐藤 翔太', height: 175, weight: 70, branch: '東京道場', class: '70kg級' },
  { id: 2, name: '鈴木 健一', height: 180, weight: 75, branch: '大阪道場', class: '80kg級' },
  { id: 3, name: '高橋 悠人', height: 170, weight: 65, branch: '名古屋道場', class: '60kg級' },
  { id: 4, name: '田中 直樹', height: 185, weight: 80, branch: '福岡道場', class: '80kg級' },
  { id: 5, name: '伊藤 陽介', height: 178, weight: 72, branch: '札幌道場', class: '70kg級' },
  { id: 6, name: '山本 拓真', height: 182, weight: 78, branch: '東京道場', class: '80kg級' },
  { id: 7, name: '中村 颯太', height: 168, weight: 60, branch: '大阪道場', class: '60kg級' },
  { id: 8, name: '小林 智也', height: 190, weight: 85, branch: '沖縄道場', class: '80kg級' },

  { id: 9, name: '小林 智也1', height: 190, weight: 85, branch: '沖縄道場', class: '80kg級' },
  { id: 10, name: '小林 智也2', height: 190, weight: 85, branch: '沖縄道場', class: '80kg級' },
  { id: 11, name: '小林 智也3', height: 190, weight: 85, branch: '沖縄道場', class: '80kg級' },
  { id: 12, name: '小林 智也4', height: 190, weight: 85, branch: '沖縄道場', class: '80kg級' },
  { id: 13, name: '小林 智也5', height: 190, weight: 85, branch: '沖縄道場', class: '80kg級' },
];

const defaultTeams = [
  { id: 1, name: 'Team 1', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 6 },
  { id: 2, name: 'Team 2', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 5 },
  { id: 3, name: 'Team 3', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 7 },
  { id: 4, name: 'Team 4', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 8 },
  { id: 5, name: 'Team 5', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 2 },
  { id: 6, name: 'Team 6', isWinner: false, points: null, status: 'fighting', branch: 1, competitorId: 1 },
  { id: 7, name: 'Team 7', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 3 },
  { id: 8, name: 'Team 8', isWinner: false, points: null, status: 'fighting', branch: 2, competitorId: 4 },
];


// Hàm để đảm bảo mỗi cặp đấu có 1 đội thắng
const ensureOneWinnerPerPair = (teams) => {
  for (let i = 0; i < teams.length; i += 2) {
    const team1 = teams[i];
    const team2 = teams[i + 1];
    
    // Đảm bảo cả hai đội tồn tại
    if (!team1 || !team2) {
      if (team1) {
        team1.isWinner = true;
      }
      if (team2) {
        team2.isWinner = true;
      }
      continue;
    }

    // So sánh điểm và xác định đội thắng
    if (team1.points > team2.points) {
      team1.isWinner = true;
      team2.isWinner = false;
    } else if (team1.points < team2.points) {
      team1.isWinner = false;
      team2.isWinner = true;
    } else {
      // Nếu điểm bằng nhau, chọn đội đầu tiên thắng
      team1.isWinner = true;
      team2.isWinner = false;
    }
  }
  return teams;
};

// Add this new function
const determineRandomWinners = (teams) => {
  const updatedTeams = teams.map(team => ({
    ...team,
    points: Math.floor(Math.random() * 10) + 1, // Random points between 1-10
    status: 'finished'
  }));
  return ensureOneWinnerPerPair(updatedTeams);
};

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

const DraggablePlayer = ({ player, index, isPlaced = false, fromBracket = false, isStart = false }) => {
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
      className={` border rounded shadow 
        ${isDragging ? 'opacity-50' : ''} 
        ${isPlaced || !isStart ? 'bg-gray-200' : 'bg-white'} 
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

const BracketSlot = ({ onDrop, player, index, onRemove, classNameCustom, isStart = false }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.PLAYER,
    drop: (item) => onDrop(item, index),
    canDrop: () => true,
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    }),
  }));

  return (
    <div
      ref={drop}
      className={`slotWrapper p-2 border ${!isOver || !isStart ? 'bg-white' : 'bg-gray-100'} ${classNameCustom}` }
        style={{ pointerEvents: isStart ? 'none' : 'auto' }}
    >
      {player ? (
        <div className="flex items-center justify-between gap-2">
          <DraggablePlayer
            player={player}
            index={index}
            isPlaced={true}
            fromBracket={true}
            isStart={isStart}
          />
          <div className="flex flex-col gap-2">
            {onRemove && !isStart && (
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
        <span className="text-gray-400">{player?.name ?? '未設定'}</span>
      )}
    </div>
  );
};

const TournamentBracket = () => {
  const [playerCount, setPlayerCount] = useState(2);
  const [playerBlock1, setPlayerBlock1] = useState(1);
  const [playerBlock2, setPlayerBlock2] = useState(1);
  const [brackets, setBrackets] = useState(() => {
    // 初期スロットを生成
    const initialBrackets = {};
    for (let i = 0; i < 4; i++) {
      initialBrackets[i] = null;
    }
    return initialBrackets;
  });

  const [branch1, setBranch1] = useState(() => {
    let newBranch1 = [];
    newBranch1['round1'] = defaultTeams.filter(item => item.branch === 1);
    return newBranch1;
  });
  const [branch2, setBranch2] = useState(() => {
    let newBranch2 = [];
    newBranch2['round1'] = defaultTeams.filter(item => item.branch === 2);
    return newBranch2;
  });
  const [final, setFinal] = useState([]);
  const [isStart, setIsStart] = useState(false);
  

  // スロット数変更時の処理
  const handlePlayerCountChange = (e) => {
    const newCount = parseInt(e.target.value);
    setPlayerCount(newCount);
    let _playerBlock1 = newCount % 2 === 0 ? newCount / 2 : Math.floor(newCount / 2) + 1;
    let oddCondition = _playerBlock1 % 2 !== 0 && (newCount - _playerBlock1) % 2 !== 0;
    setPlayerBlock1( oddCondition ? _playerBlock1 + 1 : _playerBlock1);
    setPlayerBlock2(oddCondition ? newCount - _playerBlock1 - 1 : newCount - _playerBlock1);

    // bracketsを新しい数で初期化
    const newBrackets = [];
    for (let i = 0; i < newCount; i++) {
      newBrackets[i] = null;
    }
    setBrackets(defaultTeams);
    setPlacedPlayers(new Set()); // 配置済みプレイヤーもリセット

    
    
    setTimeout(() => {
      //set round 1
      let branch1 = [];
      let branch2 = [];
      let final = [];
      branch1['round1'] = [
        { id: 1, name: 'Team 1', isWinner: true, points: 10, status: 'finished', branch: 1, competitorId: 6 },
        { id: 2, name: 'Team 2', isWinner: false, points: 9, status: 'finished', branch: 1, competitorId: 5 },
        { id: 5, name: 'Team 5', isWinner: true, points: 2, status: 'finished', branch: 1, competitorId: 2 },
        { id: 6, name: 'Team 6', isWinner: false, points: 1, status: 'finished', branch: 1, competitorId: 1 },
      ]
      branch2['round1'] = [
        { id: 3, name: 'Team 3', isWinner: false, points: 5, status: 'finished', branch: 2, competitorId: 7 },
        { id: 4, name: 'Team 4', isWinner: true, points: 7, status: 'finished', branch: 2, competitorId: 8 },
        { id: 7, name: 'Team 7', isWinner: true, points: 6, status: 'finished', branch: 2, competitorId: 3 },
        { id: 8, name: 'Team 8', isWinner: false, points: 5, status: 'finished', branch: 2, competitorId: 4 },
      ]
      //set round 2
      branch1['round2'] = [
        { id: 1, name: 'Team 1', isWinner: true, points: 9, status: 'finished', branch: 1, competitorId: 6 },
        { id: 5, name: 'Team 5', isWinner: false, points: 8, status: 'finished', branch: 1, competitorId: 2 },
      ]
      branch2['round2'] = [
        { id: 4, name: 'Team 4', isWinner: false, points: 2, status: 'finished', branch: 2, competitorId: 8 },
        { id: 7, name: 'Team 7', isWinner: true, points: 6, status: 'finished', branch: 2, competitorId: 3 },
      ]
      //set final
      final = [
        { id: 1, name: 'Team 1', isWinner: true, points: 7, status: 'finished', branch: 1, competitorId: 6 },
        { id: 7, name: 'Team 7', isWinner: false, points: 4, status: 'finished', branch: 2, competitorId: 3 },
      ]
      setBranch1(branch1)
      setBranch2(branch2)
      setFinal(final)
      console.log('branch1', branch1)
      console.log('branch2', branch2)
    }, 100);
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
    console.log("nhay vao day de xoa:")
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

  const calcRound = (personsOnRound) => {
    return Math.ceil(Math.log2(personsOnRound));
  }

  const calcRoundDetail = (blockIndex, index) => {
    return (blockIndex === 0 ? calcRoundDetailItem(playerBlock1, index) : calcRoundDetailItem(playerBlock2, index));
  }

  const calcRoundDetailItem = (personsOnRound, index) => {
    return (personsOnRound % 2 !== 0 ? Math.ceil((personsOnRound + 1) / Math.pow(2, index + 1)) : Math.ceil(personsOnRound / Math.pow(2, index + 1)));
  }

  const calcMemberOnRound = (blockIndex, index) => {
    let members = blockIndex === 0 ? playerBlock1 : playerBlock2;
    let result = members;
    for (let i = 0; i < index; i++) {
      result = Math.ceil(result / 2);
    }
    return result;
  }

  const checkOddMember = (blockIndex) => {
    let members = blockIndex === 0 ? playerBlock1 : playerBlock2; 
    return members % 2 !== 0;
  }

  const getOddClass = (borderIndex, blockIndex, index) => {
    if ( index == 2 && borderIndex == 0) { // round 3
      if (calcMemberOnRound(blockIndex, 0) % 2 == 0 && calcMemberOnRound(blockIndex, 1 ) % 2 !== 0) { // truong hop 18
        return 'tournamentBorderWrapper_odd_top_lv3_1';
      } else if (calcMemberOnRound(blockIndex, 0) % 2 == 0 && calcMemberOnRound(blockIndex, 1 ) % 2 == 0) { // truong hop 22
        return 'tournamentBorderWrapper_odd_top_lv3_4';
      }else if ( calcMemberOnRound(blockIndex, 0) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 !== 0 ) {   //Truong hop 17
        return 'tournamentBorderWrapper_odd_top_lv3_2';
      } else if (calcMemberOnRound(blockIndex, 0) % 2 !== 0 && calcMemberOnRound(blockIndex, 1 ) % 2 == 0) {  //truong hop 20
        return 'tournamentBorderWrapper_odd_top_lv3_3';
      }
    }

    if ( index == 3 ) {
      if(calcMemberOnRound(blockIndex, 2) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 !== 0 && calcMemberOnRound(blockIndex, 0) % 2 !== 0 ) {
        return 'tournamentBorderWrapper_odd_bottom_lv4_1';
      } else if (calcMemberOnRound(blockIndex, 2) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 !== 0 && calcMemberOnRound(blockIndex, 0) % 2 == 0 ) {
        return 'tournamentBorderWrapper_odd_bottom_lv4_2'; //Vong 4 - 34
      } else if (calcMemberOnRound(blockIndex, 2) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 == 0 && calcMemberOnRound(blockIndex, 0) % 2 !== 0 ) {
        return 'tournamentBorderWrapper_odd_bottom_lv4_3'; //Vong 4 - 37
      } else if (calcMemberOnRound(blockIndex, 2) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 == 0 && calcMemberOnRound(blockIndex, 0) % 2 == 0 ) {
        return 'tournamentBorderWrapper_odd_bottom_lv4_4'; //Vong 4 - 38
      } 
    }

    return borderIndex == 0 ? 'tournamentBorderWrapper_odd_top' : 'tournamentBorderWrapper_odd_bottom' ;
  };

  const getClass = (borderindex, index, membersInOldRound, blockIndex) => {
    let memberOnRoundOne = calcMemberOnRound(blockIndex, 0);
    if((index+1) % 2 == 0 && borderindex == 0 && index > 0 && membersInOldRound % 2 !== 0 ) {
      if ( index == 3 ) {
        if( calcMemberOnRound(blockIndex, 3) == 2 ){
          if(calcMemberOnRound(blockIndex, 2) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 !== 0 && calcMemberOnRound(blockIndex, 0) % 2 !== 0 ) {
            return 'tournamentBorderWrapper_top_lv4_1';
          } else if (calcMemberOnRound(blockIndex, 2) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 !== 0 && calcMemberOnRound(blockIndex, 0) % 2 == 0 ) {
            return 'tournamentBorderWrapper_top_lv4_2';
          } else if (calcMemberOnRound(blockIndex, 2) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 == 0 && calcMemberOnRound(blockIndex, 0) % 2 !== 0 ) {
            return 'tournamentBorderWrapper_top_lv4_3';
          } else if (calcMemberOnRound(blockIndex, 2) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 == 0 && calcMemberOnRound(blockIndex, 0) % 2 == 0 ) {
            return 'tournamentBorderWrapper_top_lv4_4';
          }
        } else {
          if(calcMemberOnRound(blockIndex, 2) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 !== 0 && calcMemberOnRound(blockIndex, 0) % 2 !== 0 ) {
            return 'tournamentBorderWrapper_top_lv4_5';
          } else if (calcMemberOnRound(blockIndex, 2) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 !== 0 && calcMemberOnRound(blockIndex, 0) % 2 == 0 ) {
            return 'tournamentBorderWrapper_top_lv4_6';
          } else if (calcMemberOnRound(blockIndex, 2) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 == 0 && calcMemberOnRound(blockIndex, 0) % 2 !== 0 ) {
            return 'tournamentBorderWrapper_top_lv4_7';
          } else if (calcMemberOnRound(blockIndex, 2) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 == 0 && calcMemberOnRound(blockIndex, 0) % 2 == 0 ) {
            return 'tournamentBorderWrapper_top_lv4_8';
          }
        }
      }
      return 'tournamentBorderWrapper_top';
    } else if ((index+1) % 2 !== 0 && (borderindex + 1 == calcRoundDetail(blockIndex, index)) && index > 0 && membersInOldRound % 2 !== 0 ) {
      if ( index == 2 ) {
        if( calcMemberOnRound(blockIndex, 2) == 2 ){
          if(memberOnRoundOne % 2 !== 0) {
            return 'tournamentBorderWrapper_bottom_lv3_1';
          } else {
            return 'tournamentBorderWrapper_bottom_lv3_2';
          }
        } else {
          if( calcMemberOnRound(blockIndex, 1) % 2 !== 0 ) {
            return 'tournamentBorderWrapper_bottom_lv3_3';
          } 
        }
      }

      if ( index == 4 ) {
        if( calcMemberOnRound(blockIndex, 4) == 2 ){
          if(calcMemberOnRound(blockIndex, 3) % 2 !== 0 && calcMemberOnRound(blockIndex, 2) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 !== 0 && calcMemberOnRound(blockIndex, 0) % 2 !== 0 ) {
            return 'tournamentBorderWrapper_bottom_lv5_1';
          } else if(calcMemberOnRound(blockIndex, 3) % 2 !== 0 && calcMemberOnRound(blockIndex, 2) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 !== 0 && calcMemberOnRound(blockIndex, 0) % 2 == 0  ) {
            return 'tournamentBorderWrapper_bottom_lv5_2';
          } else if(calcMemberOnRound(blockIndex, 3) % 2 !== 0 && calcMemberOnRound(blockIndex, 2) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 == 0 && calcMemberOnRound(blockIndex, 0) % 2 !== 0  ) {
            return 'tournamentBorderWrapper_bottom_lv5_3';
          } else if(calcMemberOnRound(blockIndex, 3) % 2 !== 0 && calcMemberOnRound(blockIndex, 2) % 2 !== 0 && calcMemberOnRound(blockIndex, 1) % 2 == 0 && calcMemberOnRound(blockIndex, 0) % 2 == 0  ) {
            return 'tournamentBorderWrapper_bottom_lv5_4'; // 38
          }
        }
      }


      return 'tournamentBorderWrapper_bottom';
    } else{
      if(index == 2 ) {
        if (calcMemberOnRound(blockIndex, 2) == 2) { 
          if (calcMemberOnRound(blockIndex, 1) % 2 == 0 && calcMemberOnRound(blockIndex, 0) % 2 !== 0){
            return 'tournamentBorderWrapper_lv3_1'; // Trường hợp 3 round, round 2 không lẻ, nhưng roud 1 lại lẻ. (round 3 chỉ có 1 cặp cuối)
          } 
        } else {
          if(borderindex == 0 && calcMemberOnRound(blockIndex, 1) % 2 !== 0 && calcMemberOnRound(blockIndex, 0) % 2 !== 0) {
            return 'tournamentBorderWrapper_lv3_2';
          } else if(borderindex == 0 && calcMemberOnRound(blockIndex, 1) % 2 == 0 && calcMemberOnRound(blockIndex, 0) % 2 !== 0) {
            return 'tournamentBorderWrapper_lv3_3';
          }
        }
      } 

      if(index == 3 ) {
        if (calcMemberOnRound(blockIndex, 3) == 2) { 
          if ( calcMemberOnRound(blockIndex, 2) % 2 == 0 && calcMemberOnRound(blockIndex, 1) % 2 !== 0 && calcMemberOnRound(blockIndex, 0) % 2 !== 0){
            return 'tournamentBorderWrapper_lv4_1'; // Trường hợp 3 round, round 2 không lẻ, nhưng roud 1 lại lẻ. (round 3 chỉ có 1 cặp cuối)
          } else if (calcMemberOnRound(blockIndex, 2) % 2 == 0 && calcMemberOnRound(blockIndex, 1) % 2 !== 0 && calcMemberOnRound(blockIndex, 0) % 2 == 0) {
            return 'tournamentBorderWrapper_lv4_2';
          } else if (calcMemberOnRound(blockIndex, 2) % 2 == 0 && calcMemberOnRound(blockIndex, 1) % 2 == 0 && calcMemberOnRound(blockIndex, 0) % 2 !== 0) {
            return 'tournamentBorderWrapper_lv4_3';
          }
        } else {
          // if(borderindex == 0 && calcMemberOnRound(blockIndex, 1) % 2 !== 0 && calcMemberOnRound(blockIndex, 0) % 2 !== 0) {
          //   return 'tournamentBorderWrapper_lv3_2';
          // }
        }
      } 

      return 'tournamentBorderWrapper';
    }
  };

  useEffect(() => {
    console.log('branch1 state updated:', branch1);
  }, [branch1]);

  const [score, setScore] = useState([]);
  const [curentRound, setCurentRound] = useState(1);

  const saveData = () => {
    const hasNullValues = Object.values(brackets).some(item => item === null);
    if (hasNullValues) {
      return;
    }
    const newBrackets = Object.fromEntries(
      Object.entries(brackets).map(([key, value]) => [
        key,
        { ...value, isLose: false }, // Thêm thuộc tính isLose
      ])
    );

    setBrackets(newBrackets);

    const allPlayer = Object.values(brackets); // Lấy tất cả các giá trị từ brackets
    let roundIndex = 0;
    pairing(roundIndex, allPlayer); // phân cặp đấu
    setSelectedOption(Object.values(brackets)[0]);

    setIsStart(true);
  }


  
  const [selectedOption, setSelectedOption] = useState({});

  const [scoreMember1, setScoreMember1] = useState(0);
  const [scoreMember2, setScoreMember2] = useState(0);

//   const score = [
//   { round: 1, playerId1: 1, playerId2: 2, score1: 2, score1: 3},
// ]

  const pairing = (roundIndex,  allPlayer) => {
    for (let i = 0; i < 2; i ++) {   //Lọc qua 2 block
      let playerArray = [];
      let memberOnRound =  calcMemberOnRound(i, roundIndex);
      playerArray = i ==0 ?  allPlayer.slice(0, memberOnRound).map(item => item.id) : allPlayer.slice(memberOnRound +1).map(item => item.id);

      if(memberOnRound % 2 == 0) {
        for (let j = 0; j < memberOnRound; j += 2) {
          doPairing(roundIndex, playerArray[j], playerArray[j + 1]);
        }
      } else {
        if((roundIndex+1) % 2 !== 0) {
          doPairing(roundIndex, playerArray[0], null);
          for (let j = 1; j < memberOnRound; j += 2) {
            doPairing(roundIndex, playerArray[j], playerArray[j + 1]);
          }
        } else {
          for (let j = 0; j < memberOnRound-1; j += 2) {
            doPairing(roundIndex, playerArray[j], playerArray[j + 1]);
          }
          doPairing(roundIndex, playerArray[memberOnRound], null);
        }
      }
    }
  } 


  const doPairing = (round,  playerId1, playerId2) => {
    const newScore = { round: round, playerId1: playerId1, playerId2: playerId2, score1: null, score2: null };
    setScore(prevScores => [...prevScores, newScore]);
  } 

  // const updateScore = (round,  playerId1, playerId2, score1, score1) => {
      
  // }

  const updateScore = () => {
      console.log("Kiem tra cap dau: ", score);
      setScore(prevScores => {
        // // Tìm đối tượng có round lớn nhất
        // const maxRoundScore = prevScores.reduce((max, current) => {
        //   return (current.round > max.round) ? current : max; // So sánh để tìm round lớn nhất
        // }, prevScores[0]); // Khởi tạo với phần tử đầu tiên
        // maxRound = maxRoundScore;
        // Cập nhật score1 và score2 cho đối tượng có round lớn nhất
        return prevScores.map(s => {
          if (s.round === curentRound && s.playerId1 === selectedOption.id || s.playerId2 === selectedOption.id) {
            let _score1 = 0;
            let _score2 = 0;
            if(s.playerId1 === selectedOption.id) {
             _score1 = scoreMember1;
             _score2 = scoreMember2;
            } else {
             _score1 = scoreMember2;
             _score2 = scoreMember1;
            }
            return { ...s, score1: _score1, score2: _score2 }; // Cập nhật score1 và score2
          }
          return s;
        });
      });
      
      //Nếu toàn bộ người chơi trong round dã được cập nhật => gộp mới số người còn lai.
      if(!checkOpenNewRound()){
        let nextRound = curentRound+1;
        setCurentRound(nextRound);
        let playerArray = [];

        for (let i = 0; i < score.length; i++) {
          const s = score[i];
          
          // Kiểm tra round hiện tại
          if (s.round === nextRound-1) {
            // Nếu playerId2 là null
            if (s.playerId2 === null) {
              playerArray.push(s.playerId1);
            }
            
            // Nếu score1 > score2
            if (s.score1 !== null && s.score2 !== null) {
              if (s.score1 > s.score2) {
                playerArray.push(s.playerId1);
              } else {
                playerArray.push(s.playerId2);
              }
            }
          }
        }
        pairing(nextRound-1, playerArray);
      }
  }

  const checkOpenNewRound = () => {
    return score.some(s => 
      s.round === curentRound && 
      s.playerId1 !== null && 
      s.playerId2 !== null && 
      (s.score1 == null && 
      s.score2 == null)
    );
  };

  const handleChange1 = (e) => {
    setScoreMember1(e.target.value);
  };

  const handleChange2 = (e) => {
    setScoreMember2(e.target.value);
  };


  const handleChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = Object.values(brackets).find(option => option.id == selectedValue);
    setSelectedOption(selectedOption);
  };

  const getNumberOfPeopleRemaining = (e) => {   //thay the select bang thg nay
    return Object.values(brackets).filter(option => option && option.isLose === false);
  };

  return (
    <div className="p-4">
      <div className="mb-8">

        <div className="mb-4">
          <label htmlFor="playerCount" className="mr-2">参加人数:</label>
          <input
            id="playerCount"
            type="number"
            min="2"
            value={playerCount}
            onChange={handlePlayerCountChange}
            className="border rounded p-1 w-24"
          />

          <button onClick={() => saveData()} className="ml-3">Save</button>

          {
            isStart && (
              <div>
                
                <label htmlFor="select" className="mr-2">Vòng đấu: {curentRound}</label>
                <label htmlFor="select">Chọn VĐV:</label>
                <select id="select" value={selectedOption.id} onChange={handleChange}>
                  {Object.values(brackets).filter(option => option && option.isLose === false).map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>

                <label htmlFor="scoreMember1" className="ml-2">Điểm cho {selectedOption.name}</label>
                <input
                  id="scoreMember1"
                  type="number"
                  value={scoreMember1}
                  onChange={handleChange1}
                  className="border rounded p-1 w-24"
                />

                <label htmlFor="scoreMember2" className="ml-2">Điểm người còn lại</label>
                <input
                  id="scoreMember2"
                  type="number"
                  value={scoreMember2}
                  onChange={handleChange2}
                  className="border rounded p-1 w-24"
                />

                <button onClick={() => updateScore()} className="ml-3">Cập nhật KQ</button>
              </div>
            )
          }
        </div>

        <h2 className="text-xl font-bold my-4">トーナメント表</h2>
        <div className={`tournamentWrapper grid grid-cols-[1fr_1fr] overflow-scroll totalBlocks__2`}>
          {Array.from({ length: 2 }, (_, blockIndex) => (
            <div
              key={`block-${blockIndex}`}
              className={`
              tournamentBlockWrapper flex justify-between 
              ${blockIndex == 1 ? 'tournamentBlockWrapper__even' : ''} 
              ${blockIndex == 0 ? 'tournamentBlockWrapper__65-128' : ''}`}>
              <div className="tournamentRoundWrapper flex flex-row items-center">
                <div className="flex justify-between flex-col">
                  {Array.from({ length: blockIndex === 0 ? playerBlock1 : playerBlock2 }, (_, index) => (
                    <BracketSlot
                      key={`bracket-${blockIndex + index}`}
                      player={blockIndex === 0 ? branch1['round1'][index] : branch2['round1'][index]}
                      index={blockIndex + index}
                      onDrop={handleDrop}
                      onRemove={handleRemovePlayer}
                      isStart={isStart}
                      // classNameCustom={ index == 0 && checkOddMember(blockIndex) ? 'odd-member-css' : ''}
                    />
                  ))}
                </div>
                {/* {Array.from({ length: 5 }, (_, index) => ( 
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
                ))} */}
                {Array.from({ length: blockIndex === 0 ? calcRound(playerBlock1) : calcRound(playerBlock2) }, (_, index) => {
                  let members = calcMemberOnRound(blockIndex, index);
                  let membersInOldRound = calcMemberOnRound(blockIndex, index-1);
                  return ( 
                  <div
                    key={`round-${index}`}
                    className={`tournamentRound flex justify-cente flex-col Round-${index + 1}`}
                  >
                    {Array.from({ length: calcRoundDetail(blockIndex, index) }, (_, borderindex) => {
                      let indexPlayer = (borderindex < 1) ? borderindex : (borderindex * 2);
                      // var player1 = getPlayerForBranch(brackets, blockIndex, playerBlock1, indexPlayer);
                      // var player2 = getPlayerForBranch(brackets, blockIndex, playerBlock1, indexPlayer + 1);
                      var player1 = null;
                      var player2 = null;
                      if (branch1[`round${index + 1}`]) {
                        player1 = blockIndex === 0 ? branch1['round1'][indexPlayer] : branch2['round1'][indexPlayer];
                        player2 = blockIndex === 0 ? branch1['round1'][indexPlayer + 1] : branch2['round1'][indexPlayer + 1];
                      }
                      
                      return (
                        //  <div key={`round-${index}-${borderindex}`} className={`tournamentBorderWrapper_odd ${(index > 0 && calcMemberOnRound(blockIndex, index) % 2 !== 0) ? '!h-[2px]' : ''}`}>
                        //     <div className="tournamentOdd">
                        //       <hr className="hr-divider" />
                        //     </div>
                        // </div>
                      ( ((index+1) % 2 !== 0 && borderindex == 0 && members % 2 !== 0) || ((index+1) % 2 == 0 && borderindex + 1 == calcRoundDetail(blockIndex, index) && members % 2 !== 0)) ? (
                        <div key={`round-${index}-${borderindex}`} className={`${getOddClass(borderindex, blockIndex, index)} !h-[2px]`}>
                            <div className="tournamentOdd">
                              <hr className="hr-divider" />
                            </div>
                        </div>
                      ) : ( 
                      <div key={`round-${index}-${borderindex}`} className={`${getClass(borderindex, index, membersInOldRound, blockIndex)}`}>
                        
                        <div className={`tournamentBorder tournamentBorder_top ${player1?.isWinner ? 'line-win' : 'line-close'}`} item={player1?.name}>
                          <div className={`content-points ${blockIndex === 1 ? 'right' : 'left'}`}>{player1?.points}</div>
                        </div>
                        
                        <div className={`tournamentBorder tournamentBorder_buttom ${player2?.isWinner ? 'line-win' : 'line-close'}`} item={player2?.name}>
                          <div className={`content-points ${blockIndex === 1 ? 'right' : 'left'}`}>{player2?.points}</div>
                        </div>
                      </div> )
                    )})}
                  </div>
                )})}
              </div>
              <div className={`
                blockWiner tournamentBorder}
              `}> 
              {blockIndex == 1 && (<div className="outer-div"> 
                <div className="inner-div bg-white text-center">WINNER</div></div>)}
              </div>
              {/* { blockIndex == 0 && (
                <div>
                  <div className={`
                  blockWiner tournamentBorder}
                `}></div>
              <div class="outer-div">
                <div class="inner-div">Xin chào</div>
              </div>
                </div>
                

              ) }
              { blockIndex == 1 && (
                <div>
                  
                </div>
                

              ) } */}
              
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