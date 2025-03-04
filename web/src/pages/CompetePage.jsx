import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import './CompetePage.css';
import React from 'react';

const BracketLine = styled('div', {
  shouldForwardProp: prop => !['isWinner', 'points', 'typeLine', 'groupAlign', 'status'].includes(prop)
})(({ theme, isWinner, points, typeLine, groupAlign, status }) => ({
  width: '30px',
  height: '2px',
  backgroundColor: (isWinner && status !== 'fighting') ? theme.palette.primary.main : '#ccc',
  position: 'absolute',
  '&::after': (points || points === 0) ? {
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
    color: (isWinner && status !== 'fighting') ? theme.palette.primary.main : '#ccc'
  } : {}
}));

const TeamBox = styled(Paper, {
  shouldForwardProp: prop => !['isWinner', 'status'].includes(prop)
})(({ theme, isWinner, status }) => ({
  padding: theme.spacing(1),
  width: '150px',
  height: '40px',
  textAlign: 'center',
  border: (isWinner && status !== 'fighting') ? `2px solid ${theme.palette.primary.main}` : '1px solid #ccc',
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
    console.log('teams', teams)
    return teams;
  };

  // Cập nhật hàm ensureEightTeams để tự thêm đội trống
  const ensureEightTeams = (teams) => {
    const filledTeams = [...teams];
    while (filledTeams.length < 8) {
      filledTeams.push({ ...emptyTeam, name: `Team empty ${filledTeams.length + 1}` });
    }
    return ensureOneWinnerPerPair(filledTeams);
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

  // Add states for tournament rounds
  const [quarterFinalsTeams, setQuarterFinalsTeams] = React.useState(() => 
    ensureEightTeams([
      { name: 'Team 1', isWinner: false, points: null, status: 'fighting' },
      { name: 'Team 2', isWinner: false, points: null, status: 'fighting' },
      { name: 'Team 3', isWinner: false, points: null, status: 'fighting' },
      { name: 'Team 4', isWinner: false, points: null, status: 'fighting' },
      { name: 'Team 5', isWinner: false, points: null, status: 'fighting' },
      { name: 'Team 6', isWinner: false, points: null, status: 'fighting' },
      { name: 'Team 7', isWinner: false, points: null, status: 'fighting' },
      { name: 'Team 8', isWinner: false, points: null, status: 'fighting' },
    ])
  );
  const [semiFinals, setSemiFinals] = React.useState([]);
  const [final, setFinal] = React.useState([]);
  const [champion, setChampion] = React.useState({});

  // Add function to regenerate tournament results
  const regenerateTournament = () => {
    // Generate semi-finals
    const newSemiFinals = determineRandomWinners(
      quarterFinalsTeams
        .filter(team => team.isWinner && team.status === 'finished')
        .map(team => ({
          name: team.name,
          isWinner: false,
          points: null,
          status: 'fighting'
        }))
    );
    setSemiFinals(newSemiFinals);

    // Generate finals
    const newFinal = determineRandomWinners(
      newSemiFinals
        .filter(team => team.isWinner)
        .map(team => ({
          name: team.name,
          isWinner: false,
          points: null,
          status: 'fighting'
        }))
    );
    setFinal(newFinal);

    // Set champion
    setChampion(newFinal.find(team => team.isWinner) || {});
  };

  // Add this new function to handle randomizing semi-finals fights
  const regenerateQuarterFinals = () => {
    setQuarterFinalsTeams(ensureEightTeams(quarterFinalsTeams));
    setSemiFinals([]);
    setFinal([]);
    setChampion({});
  };

  // Add this new function to handle randomizing semi-finals fights
  const randomizeSemiFinalsFight = () => {
    setQuarterFinalsTeams(determineRandomWinners(quarterFinalsTeams));
    const newSemiFinals = (
      quarterFinalsTeams
        .filter(team => team.isWinner && team.status === 'finished')
        .map(team => ({
          name: team.name,
          isWinner: false,
          points: null,
          status: 'fighting'
        }))
    );
    setSemiFinals(newSemiFinals);
    setFinal([]);
    setChampion({});
  };  

  // Add this new function to handle randomizing final fights
  const randomizeFinalFight = () => {
    const newSemiFinals = determineRandomWinners(
      quarterFinalsTeams
        .filter(team => team.isWinner && team.status === 'finished')
        .map(team => ({
          name: team.name,
          isWinner: false,
          points: null,
          status: 'fighting'
        }))
    );
    console.log(newSemiFinals, 'newSemiFinals');
    setSemiFinals(newSemiFinals);
    const newFinal = (
      newSemiFinals
        .filter(team => team.isWinner && team.status === 'finished')
        .map(team => ({
          name: team.name,
          isWinner: false,
          points: null,
          status: 'fighting'
        }))
    );
    setFinal(newFinal);
    setChampion({});
  };

  // Initialize tournament on first render
  React.useEffect(() => {
    // regenerateTournament();
  }, []);

  // Update teams object to use state values
  const teams = {
    quarterFinals: quarterFinalsTeams,
    semiFinals,
    final,
    champion
  };

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
      {/* Add Regenerate button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={regenerateQuarterFinals}
          sx={{ mb: 2 }}
        >
          Regenerate Quarter Finals
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={randomizeSemiFinalsFight}
          color="secondary"
          sx={{ mb: 2 }}
        >
          Randomize Semi-Finals Fights
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={randomizeFinalFight}
          color="secondary"
          sx={{ mb: 2 }}
        >
          Randomize Final Fights
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={regenerateTournament}
          sx={{ mb: 2 }}
        >
          Regenerate Tournament Results
        </Button>
      </Box>

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
                  <TeamBox isWinner={team.isWinner} status={team.status}>
                    {team.isEmptyTeam ? '' : team.name}
                  </TeamBox>
                  {index % 2 === 0 && (
                    <>
                      <BracketLine 
                        isWinner={true}
                        status={team.status}
                        sx={{ right: '-32px', top: '20px' }}
                        className={`bracket-line-horizontal-level-1-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={true}
                        status={team.status}
                        sx={{ right: '-32px', top: '108px' }}
                        className={`bracket-line-horizontal-level-1-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={quarterFinalsLeft[index].isWinner}
                        status={quarterFinalsLeft[index].status}
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
                        status={quarterFinalsLeft[index + 1].status}
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
                            status={team.status}
                            sx={{ 
                              right: '-64px', 
                              top: '64px',
                              width: '32px'
                            }}
                            className={`bracket-line-horizontal-level-2-team-box-${index + 1}`}
                          />
                          <BracketLine 
                            isWinner={true}
                            status={team.status}
                            sx={{ 
                              right: '-64px', 
                              top: '240px',
                              width: '32px'
                            }}
                            className={`bracket-line-horizontal-level-2-team-box-${index + 1}`}
                          />
                          <BracketLine 
                            isWinner={teams.semiFinals[0]?.isWinner}
                            status={teams.semiFinals[0]?.status}
                            points={teams.semiFinals[0]?.points}
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
                            isWinner={teams.semiFinals[1]?.isWinner}
                            status={teams.semiFinals[1]?.status}
                            points={teams.semiFinals[1]?.points}
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
                            isWinner={teams.final[0]?.isWinner}
                            status={teams.final[0]?.status}
                            points={teams.final[0]?.points}
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
              {teams.champion?.name}
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
                  <TeamBox isWinner={team.isWinner} status={team.status}>
                    {team.isEmptyTeam ? '' : team.name}
                  </TeamBox>
                  {index % 2 === 0 && (
                    <>
                      <BracketLine 
                        isWinner={true}
                        status={team.status}
                        sx={{ left: '-32px', top: '20px' }}
                        className={`bracket-line-horizontal-level-1-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={true}
                        status={team.status}
                        sx={{ left: '-32px', top: '108px' }}
                        className={`bracket-line-horizontal-level-1-team-box-${index + 1}`}
                      />
                      <BracketLine 
                        isWinner={quarterFinalsRight[index].isWinner}
                        status={quarterFinalsRight[index].status}
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
                        status={quarterFinalsRight[index + 1].status}
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
                            status={team.status}
                            sx={{ 
                              left: '-64px', 
                              top: '64px',
                              width: '32px'
                            }}
                            className={`bracket-line-horizontal-level-2-team-box-${index + 1}`}
                          />
                          <BracketLine 
                            isWinner={true}
                            status={team.status}
                            sx={{ 
                              left: '-64px', 
                              top: '240px',
                              width: '32px'
                            }}
                            className={`bracket-line-horizontal-level-2-team-box-${index + 1}`}
                          />
                          <BracketLine 
                            isWinner={teams.semiFinals[2]?.isWinner}
                            status={teams.semiFinals[2]?.status}
                            points={teams.semiFinals[2]?.points}
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
                            isWinner={teams.semiFinals[3]?.isWinner}
                            status={teams.semiFinals[3]?.status}
                            points={teams.semiFinals[3]?.points}
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
                            isWinner={teams.final[1]?.isWinner}
                            status={teams.final[1]?.status}
                            points={teams.final[1]?.points}
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
                    <TableCell>{team?.isEmptyTeam ? '' : team?.name}</TableCell>
                    <TableCell align="right">{team?.points}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          backgroundColor: selectedRound === 'champion' ? 'gold' : 
                            team.status === 'fighting' ? '#ff9800' :  // Orange color for fighting status
                            team.isWinner ? '#4caf50' : '#f44336',
                          color: 'white',
                          py: 0.5,
                          px: 1,
                          borderRadius: 1,
                          display: 'inline-block'
                        }}
                      >
                        {selectedRound === 'champion' ? 'Champion' : 
                          team.status === 'fighting' ? 'Fighting' :
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
