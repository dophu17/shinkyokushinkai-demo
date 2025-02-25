import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import './CompetePage.css';
import React from 'react';

const BracketLine = styled('div', {
  shouldForwardProp: prop => !['isWinner', 'points', 'typeLine', 'groupAlign'].includes(prop)
})(({ theme, isWinner, points, typeLine, groupAlign }) => ({
  width: '30px',
  height: '2px',
  backgroundColor: isWinner ? theme.palette.primary.main : '#ccc',
  position: 'absolute',
  '&::after': points ? {
    content: `"${points}"`,
    position: 'absolute',
    ...(typeLine === 'top' ? {
      left: groupAlign === 'left' ? '7px' : '-25px',
      top: '60%',
      transform: 'translateY(-50%)'
    } : typeLine === 'bottom' ? {
      top: '10px',
      right: groupAlign === 'left' ? '-10px' : '20px',
      transform: 'translateX(50%)'
    } : {
      left: groupAlign === 'left' ? '45px' : '10px',
      top: '-10px',
      transform: 'translateY(-50%)'
    }),
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main
  } : {}
}));

const TeamBox = styled(Paper, {
  shouldForwardProp: prop => prop !== 'isWinner'
})(({ theme, isWinner }) => ({
  padding: theme.spacing(1),
  width: '150px',
  height: '40px',
  textAlign: 'center',
  border: isWinner ? `2px solid ${theme.palette.primary.main}` : '1px solid #ccc',
  backgroundColor: '#fff',
}));

const emptyTeam = {
  name: 'Team empty', isWinner: false, points: 0, isEmptyTeam: true
};

const CompetePage = () => {
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

  // Hàm để sắp xếp các đội, đảm bảo đội điểm 0 ở vị trí lẻ
  const arrangeTeamsWithZeroPoints = (teams) => {
    const zeroPointTeams = teams.filter(team => team.points === 0);
    const nonZeroPointTeams = teams.filter(team => team.points > 0);
    
    // Sắp xếp các đội có điểm > 0 theo thứ tự điểm giảm dần
    nonZeroPointTeams.sort((a, b) => b.points - a.points);
    
    const arrangedTeams = new Array(8);
    let nonZeroIndex = 0;
    let zeroIndex = 0;

    // Đặt các đội vào vị trí thích hợp
    for (let i = 0; i < 8; i++) {
      if (i % 2 === 0) { // Vị trí chẵn (0, 2, 4, 6)
        arrangedTeams[i] = nonZeroPointTeams[nonZeroIndex] || { ...emptyTeam, name: `Team empty ${i + 1}` };
        nonZeroIndex++;
      } else { // Vị trí lẻ (1, 3, 5, 7)
        if (zeroIndex < zeroPointTeams.length) {
          arrangedTeams[i] = zeroPointTeams[zeroIndex];
          zeroIndex++;
        } else {
          // Nếu không còn đội điểm 0, sử dụng đội có điểm > 0 hoặc đội mặc định
          arrangedTeams[i] = nonZeroPointTeams[nonZeroIndex] || { ...emptyTeam, name: `Team empty ${i + 1}` };
          nonZeroIndex++;
        }
      }
    }

    return arrangedTeams;
  };

  // Cập nhật hàm ensureEightTeams để sử dụng arrangeTeamsWithZeroPoints
  const ensureEightTeams = (teams) => {
    const filledTeams = [...teams];
    while (filledTeams.length < 8) {
      filledTeams.push({ ...emptyTeam, name: `Team empty ${filledTeams.length + 1}` });
    }
    const arrangedTeams = arrangeTeamsWithZeroPoints(filledTeams);
    return ensureOneWinnerPerPair(arrangedTeams);
  };

  const teams = {
    quarterFinals: ensureEightTeams([
      { name: 'Team 1', isWinner: true, points: 10 },
      // { name: 'Team 2', isWinner: false, points: 8 },
      { name: 'Team 3', isWinner: true, points: 5 },
      // { name: 'Team 4', isWinner: false, points: 4 },
      // { name: 'Team 5', isWinner: true, points: 7 },
      { name: 'Team 6', isWinner: false, points: 6 },
      { name: 'Team 7', isWinner: false, points: 8 },
      { name: 'Team 8', isWinner: true, points: 9 },
    ]),
    semiFinals: [
      { name: 'Team 1', isWinner: true, points: 9 },
      { name: 'Team 3', isWinner: false, points: 8 },
      { name: 'Team 5', isWinner: true, points: 10 },
      { name: 'Team 8', isWinner: false, points: 5 },
    ],
    final: [
      { name: 'Team 1', isWinner: true, points: 10 },
      { name: 'Team 5', isWinner: false, points: 9 },
    ],
    champion: { name: 'Team 1', points: 10 }
  };
  console.log(teams.quarterFinals);
  
  const quarterFinalsLeft = teams.quarterFinals.slice(0, 4);
  const quarterFinalsRight = teams.quarterFinals.slice(4, 8);
  const [selectedRound, setSelectedRound] = React.useState('quarterFinals');

  const handleRoundChange = (event, newValue) => {
    setSelectedRound(newValue);
  };

  const getRoundTeams = () => {
    switch (selectedRound) {
      case 'quarterFinals':
        return teams.quarterFinals;
      case 'semiFinals':
        return teams.semiFinals;
      case 'final':
        return teams.final;
      case 'champion':
        return [teams.champion];
      default:
        return teams.quarterFinals;
    }
  };

  return (
    <Box sx={{ p: 4, position: 'relative' }}>
      <Box className="tournament-bracket-container">
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          Tournament Bracket
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {/* Left Branch */}
          <Box sx={{ display: 'flex', gap: 4, position: 'relative', mr: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
              {quarterFinalsLeft.map((team, index) => (
                <Box 
                  className={`team-box-${index + 1}`} 
                  key={index} 
                  sx={{ position: 'relative', mb: index % 2 === 0 ? 3 : 0 }}
                >
                  <TeamBox isWinner={team.isWinner}>
                    {team.isEmptyTeam ? '' : team.name}
                  </TeamBox>
                  {index % 2 === 0 && (
                    <>
                      <BracketLine 
                        isWinner={true}
                        sx={{ right: '-32px', top: '20px' }}
                        className={`bracket-line-horizontal-level-1-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={true}
                        sx={{ right: '-32px', top: '108px' }}
                        className={`bracket-line-horizontal-level-1-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={quarterFinalsLeft[index].isWinner}
                        points={quarterFinalsLeft[index].points}
                        typeLine="top"
                        groupAlign="left"
                        sx={{ 
                          right: '-32px',
                          top: '20px',
                          height: '44px',
                          width: '2px'
                        }}
                        className={`bracket-line-vertical-level-1-team-box-${index + 1}-top`}
                      />
                      <BracketLine 
                        isWinner={quarterFinalsLeft[index + 1].isWinner}
                        points={quarterFinalsLeft[index + 1].points}
                        typeLine="bottom"
                        groupAlign="left"
                        sx={{ 
                          right: '-32px',
                          top: '64px',
                          height: '44px',
                          width: '2px'
                        }}
                        className={`bracket-line-vertical-level-1-team-box-${index + 1}-bottom`}
                      />
                      {/* Semi-finals to Finals connection */}
                      {index === 0 && (
                        <>
                          <BracketLine 
                            isWinner={true}
                            sx={{ 
                              right: '-64px', 
                              top: '64px',
                              width: '32px'
                            }}
                            className={`bracket-line-horizontal-level-2-team-box-${index + 1}`}
                          />
                          <BracketLine 
                            isWinner={true}
                            sx={{ 
                              right: '-64px', 
                              top: '240px',
                              width: '32px'
                            }}
                            className={`bracket-line-horizontal-level-2-team-box-${index + 1}`}
                          />
                          <BracketLine 
                            isWinner={teams.semiFinals[0].isWinner}
                            points={teams.semiFinals[0].points}
                            typeLine="top"
                            groupAlign="left"
                            sx={{ 
                              right: '-64px',
                              top: '64px',
                              height: '88px',
                              width: '2px'
                            }}
                            className={`bracket-line-vertical-level-2-team-box-${index + 1}-top`}
                          />
                          <BracketLine 
                            isWinner={teams.semiFinals[1].isWinner}
                            points={teams.semiFinals[1].points}
                            typeLine="bottom"
                            groupAlign="left"
                            sx={{ 
                              right: '-64px',
                              top: '152px',
                              height: '88px',
                              width: '2px'
                            }}
                            className={`bracket-line-vertical-level-2-team-box-${index + 1}-bottom`}
                          />
                          <BracketLine 
                            isWinner={teams.final[0].isWinner}
                            points={teams.final[0].points}
                            typeLine="horizontal"
                            groupAlign="left"
                            sx={{ 
                              right: '-129px',
                              top: '152px',
                              width: '67px'
                            }}
                            className={`bracket-line-horizontal-level-3-team-box-${index + 1}`}
                          />
                        </>
                      )}
                    </>
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Champion */}
          <Box sx={{ alignSelf: 'flex-start', mx: 4, mt: 16.5 }}>
            <TeamBox sx={{ backgroundColor: 'gold !important', position: 'relative', zIndex: 1 }}>
              {teams.champion.name}
            </TeamBox>
          </Box>

          {/* Right Branch */}
          <Box sx={{ display: 'flex', gap: 4, flexDirection: 'row-reverse', position: 'relative', ml: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
              {quarterFinalsRight.map((team, index) => (
                <Box 
                  className={`team-box-${index + 5}`} 
                  key={index} 
                  sx={{ position: 'relative', mb: index % 2 === 0 ? 3 : 0 }}
                >
                  <TeamBox isWinner={team.isWinner}>
                    {team.isEmptyTeam ? '' : team.name}
                  </TeamBox>
                  {index % 2 === 0 && (
                    <>
                      <BracketLine 
                        isWinner={true}
                        sx={{ left: '-32px', top: '20px' }}
                        className={`bracket-line-horizontal-level-1-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={true}
                        sx={{ left: '-32px', top: '108px' }}
                        className={`bracket-line-horizontal-level-1-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={quarterFinalsRight[index].isWinner}
                        points={quarterFinalsRight[index].points}
                        typeLine="top"
                        groupAlign="right"
                        sx={{ 
                          left: '-32px',
                          top: '20px',
                          height: '44px',
                          width: '2px'
                        }}
                        className={`bracket-line-vertical-level-1-team-box-${index + 1}-top`}
                      />
                      <BracketLine 
                        isWinner={quarterFinalsRight[index + 1].isWinner}
                        points={quarterFinalsRight[index + 1].points}
                        typeLine="bottom"
                        groupAlign="right"
                        sx={{ 
                          left: '-32px',
                          top: '64px',
                          height: '44px',
                          width: '2px'
                        }}
                        className={`bracket-line-vertical-level-1-team-box-${index + 1}-bottom`}
                      />
                      {/* Semi-finals to Finals connection */}
                      {index === 0 && (
                        <>
                          <BracketLine 
                            isWinner={true}
                            sx={{ 
                              left: '-64px', 
                              top: '64px',
                              width: '32px'
                            }}
                            className={`bracket-line-horizontal-level-2-team-box-${index + 1}`}
                          />
                          <BracketLine 
                            isWinner={true}
                            sx={{ 
                              left: '-64px', 
                              top: '240px',
                              width: '32px'
                            }}
                            className={`bracket-line-horizontal-level-2-team-box-${index + 1}`}
                          />
                          <BracketLine 
                            isWinner={teams.semiFinals[2].isWinner}
                            points={teams.semiFinals[2].points}
                            typeLine="top"
                            groupAlign="right"
                            sx={{ 
                              left: '-64px',
                              top: '64px',
                              height: '88px',
                              width: '2px'
                            }}
                            className={`bracket-line-vertical-level-2-team-box-${index + 1}-top`}
                          />
                          <BracketLine 
                            isWinner={teams.semiFinals[3].isWinner}
                            points={teams.semiFinals[3].points}
                            typeLine="bottom"
                            groupAlign="right"
                            sx={{ 
                              left: '-64px',
                              top: '152px',
                              height: '88px',
                              width: '2px'
                            }}
                            className={`bracket-line-vertical-level-2-team-box-${index + 1}-bottom`}
                          />
                          <BracketLine 
                            isWinner={teams.final[1].isWinner}
                            points={teams.final[1].points}
                            typeLine="horizontal"
                            groupAlign="right"
                            sx={{ 
                              left: '-129px',
                              top: '152px',
                              width: '67px'
                            }}
                            className={`bracket-line-horizontal-level-3-team-box-${index + 1}`}
                          />
                        </>
                      )}
                    </>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className="list-teams-container">
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          List of Teams
        </Typography>
        <Box className="list-table-teams-box">
          <Tabs
            value={selectedRound}
            onChange={handleRoundChange}
            sx={{ mb: 2 }}
            centered
          >
            <Tab label="Quarter Finals" value="quarterFinals" />
            <Tab label="Semi Finals" value="semiFinals" />
            <Tab label="Final" value="final" />
            <Tab label="Champion" value="champion" />
          </Tabs>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="teams table">
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Team Name</TableCell>
                  <TableCell align="right">Points</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getRoundTeams().map((team, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell>{team.isEmptyTeam ? '' : team.name}</TableCell>
                    <TableCell align="right">{team.points}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          backgroundColor: selectedRound === 'champion' ? 'gold' : 
                            team.isWinner ? '#4caf50' : '#f44336',
                          color: 'white',
                          py: 0.5,
                          px: 1,
                          borderRadius: 1,
                          display: 'inline-block'
                        }}
                      >
                        {selectedRound === 'champion' ? 'Champion' : 
                          team.isWinner ? 'Winner' : 'Eliminated'}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default CompetePage;
