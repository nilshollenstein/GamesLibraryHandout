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
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
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

    @Test
    void getGameById_returnsGameWithId() {
        // Arrange
        Game game = sampleGame(1L, "Portal 2");
        when(gameRepository.findById(1L)).thenReturn(Optional.of(game));

        // Act
        Game result = gameService.getGameById(1L);

        // Assert
        assertThat(result).isEqualTo(game);
        verify(gameRepository).findById(1L);
    }

    @Test
    void getGameById_throwsExceptionWhenIdNotFound() {
        // Arrange
        when(gameRepository.findById(99L)).thenReturn(Optional.empty());

        // Act + Assert
        assertThatThrownBy(() -> gameService.getGameById(99L))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessageContaining("99");
    }

    @Test
    void createGame_returnsGame(){
        // Arrange
        Game newGame = sampleGame(null, "Portal 2");
        Game savedGame = sampleGame(1L, "Portal 2");

        when(gameRepository.save(newGame)).thenReturn(savedGame);

        // Act
        Game result = gameService.createGame(newGame);

        // Assert
        assertThat(result.getId()).isEqualTo(1L);
        verify(gameRepository).save(newGame);
    }

    @Test
    void updateGame_OverwritesAllFields(){
        // Arrange
        Game game = sampleGame(1L, "Portal 2");
        Game updatedGame = Game.builder()
                .id(1L)
                .title("Half-Life")
                .releaseDate(LocalDate.of(2008, 1, 15))
                .description("Neue Beschreibung")
                .imageUrl("https://google.com/image.jpg")
                .build();

        when(gameRepository.findById(1L)).thenReturn(Optional.of(game));
        when(gameRepository.save(updatedGame)).thenReturn(updatedGame);

        // Act
        Game result = gameService.updateGame(1L, updatedGame);

        // Assert
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Half-Life");
        assertThat(result.getReleaseDate()).isEqualTo(LocalDate.of(2008, 1, 15));
        assertThat(result.getDescription()).isEqualTo("Neue Beschreibung");
        assertThat(result.getImageUrl()).isEqualTo("https://google.com/image.jpg");
        verify(gameRepository).save(game);
    }

    @Test
    void updateGame_throwsExceptionWhenIdNotFound() {
        //
        Game game = sampleGame(1L, "Portal 2");
        when(gameRepository.findById(99L)).thenReturn(Optional.empty());

        // Act + Assert
        assertThatThrownBy(() -> gameService.updateGame(99L,game ))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessageContaining("99");
    }
}
