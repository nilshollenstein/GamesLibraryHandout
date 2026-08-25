package ch.diethelm.backend.service;

import ch.diethelm.backend.model.Game;
import ch.diethelm.backend.repository.GameRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class) // Aktiviert Mockito für diese Testklasse
class GameServiceTest {


    @Mock
    private GameRepository gameRepository;

    @InjectMocks
    private GameService gameService;

    private Game sampleGame(Long id, String title) {
        return Game.builder()
                .id(id)
                .title(title)
                .description("Beschreibung von " + title)
                .imageUrl("https://example.com/" + id + ".jpg")
                .releaseDate(LocalDate.of(2020, 1, 15))
                .build();
    }

    private List<Game> getGameList(){
        return List.of(
                sampleGame(1L, "Portal 2"),
                sampleGame(2L, "Half-Life")
        );
    }

    @Test
    void getAllGames_returnsListFromRepository() {
        // Arrange
        List<Game> games = getGameList();
        when(gameRepository.findAll()).thenReturn(games);

        // Act
        List<Game> result = gameService.getAllGames();

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result).isEqualTo(games);

        verify(gameRepository).findAll();
    }
}
